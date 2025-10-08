import { cache } from './cache'
import { cacheKeys } from './cache'

// Real-time cache updates via WebSocket events
export const realtimeCache = {
  // Handle list created event
  async handleListCreated(data: { boardId: string; list: any }) {
    await cache.addListToBoard(data.boardId, data.list)
  },

  // Handle list updated event
  async handleListUpdated(data: { boardId: string; list: any }) {
    await cache.updateListInBoard(data.boardId, data.list)
  },

  // Handle list deleted event
  async handleListDeleted(data: { boardId: string; listId: string }) {
    await cache.removeListFromBoard(data.boardId, data.listId)
  },

  // Handle card created event
  async handleCardCreated(data: { listId: string; card: any }) {
    await cache.addCardToList(data.listId, data.card)
  },

  // Handle card updated event
  async handleCardUpdated(data: { listId: string; card: any }) {
    await cache.updateCardInList(data.listId, data.card)
  },

  // Handle card deleted event
  async handleCardDeleted(data: { listId: string; cardId: string }) {
    await cache.removeCardFromList(data.listId, data.cardId)
  },

  // Handle card moved event
  async handleCardMoved(data: { 
    cardId: string; 
    oldListId: string; 
    newListId: string; 
    card: any 
  }) {
    // Remove from old list
    await cache.removeCardFromList(data.oldListId, data.cardId)
    // Add to new list
    await cache.addCardToList(data.newListId, data.card)
  },

  // Handle list moved event
  async handleListMoved(data: { 
    boardId: string; 
    list: any 
  }) {
    await cache.updateListInBoard(data.boardId, data.list)
  },

  // Handle board updated event
  async handleBoardUpdated(data: { boardId: string; board: any }) {
    await cache.updateBoard(data.boardId, data.board)
  },

  // Handle org limit updated event
  async handleOrgLimitUpdated(data: { orgId: string; limit: any }) {
    await cache.updateOrgLimit(data.orgId, data.limit)
  }
}
