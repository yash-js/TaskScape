import { db } from './db'
import { cache, cacheKeys, CACHE_TTL } from './cache'
import { dbQuery } from './performance-monitor'
import { Board, List, Card, OrgLimit } from '@prisma/client'

// Optimized board operations
export const boardService = {
  async getBoardWithLists(boardId: string, orgId: string): Promise<any[]> {
    const cacheKey = cacheKeys.boardLists(boardId)
    
    // Try cache first
    const cached = await cache.get<List[]>(cacheKey)
    if (cached) return cached

    // Fetch from database with optimized query
    const lists = await dbQuery.measure('getBoardWithLists', () => 
      db.list.findMany({
        where: {
          boardId,
          board: { orgId }
        },
        include: {
          cards: {
            select: {
              id: true,
              title: true,
              order: true,
              description: true,
              listId: true,
              createdAt: true,
              updatedAt: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      })
    )

    // Cache the result
    await cache.set(cacheKey, lists, CACHE_TTL.LISTS)
    return lists
  },

  async getOrgBoards(orgId: string) {
    const cacheKey = cacheKeys.orgBoards(orgId)
    
    const cached = await cache.get<Board[]>(cacheKey)
    if (cached) return cached

    const boards = await db.board.findMany({
      where: { orgId },
      select: {
        id: true,
        title: true,
        imageThumbUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    await cache.set(cacheKey, boards, CACHE_TTL.BOARD)
    return boards
  }
}

// Optimized list operations
export const listService = {
  async createList(data: { title: string; boardId: string; orgId: string }) {
    // Use a single optimized transaction
    const result = await db.$transaction(async (tx) => {
      // Get the last order in one query
      const lastList = await tx.list.findFirst({
        where: { boardId: data.boardId },
        orderBy: { order: 'desc' },
        select: { order: true }
      })

      const newOrder = lastList ? lastList.order + 1 : 1

      // Create the list
      const list = await tx.list.create({
        data: {
          title: data.title,
          boardId: data.boardId,
          order: newOrder,
        },
        select: {
          id: true,
          title: true,
          order: true,
          boardId: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return list
    })

    // Update cache with new list (write-through)
    await cache.addListToBoard(data.boardId, result)
    
    return result
  },

  async updateListOrder(listId: string, newOrder: number, boardId: string) {
    const updatedList = await db.list.update({
      where: { id: listId },
      data: { order: newOrder },
      select: {
        id: true,
        title: true,
        order: true,
        boardId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Update cache with new order
    await cache.updateListInBoard(boardId, updatedList)
  },

  async deleteList(listId: string, boardId: string) {
    await db.list.delete({
      where: { id: listId }
    })

    // Remove from cache
    await cache.removeListFromBoard(boardId, listId)
  }
}

// Optimized card operations
export const cardService = {
  async createCard(data: { title: string; listId: string; boardId: string; orgId: string }) {
    const result = await db.$transaction(async (tx) => {
      // Verify list exists and get last order
      const [list, lastCard] = await Promise.all([
        tx.list.findUnique({
          where: { id: data.listId, board: { orgId: data.orgId } },
          select: { id: true }
        }),
        tx.card.findFirst({
          where: { listId: data.listId },
          orderBy: { order: 'desc' },
          select: { order: true }
        })
      ])

      if (!list) throw new Error('List not found')

      const newOrder = lastCard ? lastCard.order + 1 : 1

      const card = await tx.card.create({
        data: {
          title: data.title,
          listId: data.listId,
          order: newOrder,
        },
        select: {
          id: true,
          title: true,
          order: true,
          description: true,
          listId: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return card
    })

    // Update cache with new card (write-through)
    await cache.addCardToList(data.listId, result)
    
    return result
  },

  async updateCardOrder(cardId: string, newOrder: number, newListId: string, boardId: string) {
    const updatedCard = await db.card.update({
      where: { id: cardId },
      data: { 
        order: newOrder,
        listId: newListId
      },
      select: {
        id: true,
        title: true,
        order: true,
        description: true,
        listId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Update cache with new card position
    await cache.updateCardInList(newListId, updatedCard)
  },

  async deleteCard(cardId: string, listId: string) {
    await db.card.delete({
      where: { id: cardId }
    })

    // Remove from cache
    await cache.removeCardFromList(listId, cardId)
  }
}

// Optimized org operations
export const orgService = {
  async getOrgLimit(orgId: string) {
    const cacheKey = cacheKeys.orgLimit(orgId)
    
    const cached = await cache.get<OrgLimit>(cacheKey)
    if (cached) return cached

    const orgLimit = await db.orgLimit.findUnique({
      where: { orgId },
      select: {
        id: true,
        orgId: true,
        count: true
      }
    })

    if (orgLimit) {
      await cache.set(cacheKey, orgLimit, CACHE_TTL.ORG_LIMIT)
    }

    return orgLimit
  },

  async incrementOrgLimit(orgId: string) {
    const result = await db.orgLimit.upsert({
      where: { orgId },
      update: { count: { increment: 1 } },
      create: { orgId, count: 1 },
      select: {
        id: true,
        orgId: true,
        count: true
      }
    })

    // Update cache with new limit (write-through)
    await cache.updateOrgLimit(orgId, result)
    return result
  }
}
