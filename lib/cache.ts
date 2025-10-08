import { redis, isRedisAvailable } from './upstash-config'

// Cache configuration
const CACHE_TTL = {
  BOARD: 300, // 5 minutes
  LISTS: 180, // 3 minutes
  CARDS: 120, // 2 minutes
  USER: 600, // 10 minutes
  ORG_LIMIT: 300, // 5 minutes
}

// Cache key generators
export const cacheKeys = {
  board: (boardId: string) => `board:${boardId}`,
  boardLists: (boardId: string) => `board:${boardId}:lists`,
  listCards: (listId: string) => `list:${listId}:cards`,
  orgBoards: (orgId: string) => `org:${orgId}:boards`,
  orgLimit: (orgId: string) => `org:${orgId}:limit`,
  user: (userId: string) => `user:${userId}`,
}

// Cache operations with write-through strategy
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisAvailable()) return null
    
    try {
      const value = await redis!.get(key)
      return value as T | null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!isRedisAvailable()) return
    
    try {
      await redis!.setex(key, ttl, value)
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  async del(key: string): Promise<void> {
    if (!isRedisAvailable()) return
    
    try {
      await redis!.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!isRedisAvailable()) return
    
    try {
      const keys = await redis!.keys(pattern)
      if (keys.length > 0) {
        await redis!.del(...keys)
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error)
    }
  },

  // Write-through cache updates (update cache with new data)
  async updateBoard(boardId: string, boardData: any): Promise<void> {
    await this.set(cacheKeys.board(boardId), boardData, CACHE_TTL.BOARD)
  },

  async updateBoardLists(boardId: string, listsData: any[]): Promise<void> {
    await this.set(cacheKeys.boardLists(boardId), listsData, CACHE_TTL.LISTS)
  },

  async updateOrgBoards(orgId: string, boardsData: any[]): Promise<void> {
    await this.set(cacheKeys.orgBoards(orgId), boardsData, CACHE_TTL.BOARD)
  },

  async updateOrgLimit(orgId: string, limitData: any): Promise<void> {
    await this.set(cacheKeys.orgLimit(orgId), limitData, CACHE_TTL.ORG_LIMIT)
  },

  // Add new list to cached board lists
  async addListToBoard(boardId: string, newList: any): Promise<void> {
    const cacheKey = cacheKeys.boardLists(boardId)
    const existingLists = await this.get<any[]>(cacheKey)
    
    if (existingLists) {
      const updatedLists = [...existingLists, newList].sort((a, b) => a.order - b.order)
      await this.set(cacheKey, updatedLists, CACHE_TTL.LISTS)
    }
  },

  // Add new card to cached list
  async addCardToList(listId: string, newCard: any): Promise<void> {
    const cacheKey = cacheKeys.listCards(listId)
    const existingCards = await this.get<any[]>(cacheKey)
    
    if (existingCards) {
      const updatedCards = [...existingCards, newCard].sort((a, b) => a.order - b.order)
      await this.set(cacheKey, updatedCards, CACHE_TTL.CARDS)
    }
  },

  // Update list in cached board lists
  async updateListInBoard(boardId: string, updatedList: any): Promise<void> {
    const cacheKey = cacheKeys.boardLists(boardId)
    const existingLists = await this.get<any[]>(cacheKey)
    
    if (existingLists) {
      const updatedLists = existingLists.map(list => 
        list.id === updatedList.id ? updatedList : list
      )
      await this.set(cacheKey, updatedLists, CACHE_TTL.LISTS)
    }
  },

  // Update card in cached list
  async updateCardInList(listId: string, updatedCard: any): Promise<void> {
    const cacheKey = cacheKeys.listCards(listId)
    const existingCards = await this.get<any[]>(cacheKey)
    
    if (existingCards) {
      const updatedCards = existingCards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
      await this.set(cacheKey, updatedCards, CACHE_TTL.CARDS)
    }
  },

  // Remove list from cached board lists
  async removeListFromBoard(boardId: string, listId: string): Promise<void> {
    const cacheKey = cacheKeys.boardLists(boardId)
    const existingLists = await this.get<any[]>(cacheKey)
    
    if (existingLists) {
      const updatedLists = existingLists.filter(list => list.id !== listId)
      await this.set(cacheKey, updatedLists, CACHE_TTL.LISTS)
    }
  },

  // Remove card from cached list
  async removeCardFromList(listId: string, cardId: string): Promise<void> {
    const cacheKey = cacheKeys.listCards(listId)
    const existingCards = await this.get<any[]>(cacheKey)
    
    if (existingCards) {
      const updatedCards = existingCards.filter(card => card.id !== cardId)
      await this.set(cacheKey, updatedCards, CACHE_TTL.CARDS)
    }
  },

  // Invalidation methods (fallback when we can't update)
  async invalidateBoard(boardId: string): Promise<void> {
    await Promise.all([
      this.del(cacheKeys.board(boardId)),
      this.del(cacheKeys.boardLists(boardId)),
      this.delPattern(`board:${boardId}:*`),
    ])
  },

  async invalidateOrg(orgId: string): Promise<void> {
    await Promise.all([
      this.del(cacheKeys.orgBoards(orgId)),
      this.del(cacheKeys.orgLimit(orgId)),
      this.delPattern(`org:${orgId}:*`),
    ])
  },

  async invalidateList(listId: string): Promise<void> {
    await this.del(cacheKeys.listCards(listId))
  }
}

export { CACHE_TTL }
