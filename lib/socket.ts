import { Server as NetServer } from "http"
import { NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const SocketHandler = (req: any, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === "production" 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    })
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id)

      // Join board room for real-time updates
      socket.on("join-board", (boardId: string) => {
        socket.join(`board-${boardId}`)
        console.log(`Socket ${socket.id} joined board ${boardId}`)
      })

      // Leave board room
      socket.on("leave-board", (boardId: string) => {
        socket.leave(`board-${boardId}`)
        console.log(`Socket ${socket.id} left board ${boardId}`)
      })

      // Handle list updates
      socket.on("list-created", (data) => {
        socket.to(`board-${data.boardId}`).emit("list-created", data)
      })

      socket.on("list-updated", (data) => {
        socket.to(`board-${data.boardId}`).emit("list-updated", data)
      })

      socket.on("list-deleted", (data) => {
        socket.to(`board-${data.boardId}`).emit("list-deleted", data)
      })

      // Handle card updates
      socket.on("card-created", (data) => {
        socket.to(`board-${data.boardId}`).emit("card-created", data)
      })

      socket.on("card-updated", (data) => {
        socket.to(`board-${data.boardId}`).emit("card-updated", data)
      })

      socket.on("card-deleted", (data) => {
        socket.to(`board-${data.boardId}`).emit("card-deleted", data)
      })

      // Handle drag and drop updates
      socket.on("card-moved", (data) => {
        socket.to(`board-${data.boardId}`).emit("card-moved", data)
      })

      socket.on("list-moved", (data) => {
        socket.to(`board-${data.boardId}`).emit("list-moved", data)
      })

      // Handle cursor position for live cursors
      socket.on("cursor-move", (data) => {
        socket.to(`board-${data.boardId}`).emit("cursor-move", {
          ...data,
          socketId: socket.id
        })
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }
  res.end()
}
