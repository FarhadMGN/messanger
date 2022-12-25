const { createServer } = require('http')
const express = require("express")
const io = require("socket.io")
const {ALLOWED_ORIGIN} = require("./server-const")
const cors = require('cors')
const users = require('./users')()
const messages = {}

const app = express()
app.use(
    cors({
      origin: ALLOWED_ORIGIN
    })
  )
  
const server = createServer(app)
const socket = io(server, {
    cors: {
        origin: ALLOWED_ORIGIN,
        methods: ["GET", "POST"]
    },
})

const updateMessageList = (roomId) => {
    
  }

const updateUsersList = (roomId) => {
    const roomUser = users.getByRoom(roomId);
    socket.to(roomId).emit('user_list:update', roomUser)
}


socket.on('connection', (soc) => {
    //users handlers
    soc.on('userLeaveRoom', userInfo => {
        users.removeUserById(userInfo.id)
        console.log("users", users.users)
        soc.to(userInfo.roomId).emit('notification', {
            text: `User ${userInfo.name} leave room.`,
            type: "info"
        })
        updateUsersList(userInfo.roomId)
    })
    soc.on('userJoined', (data, cb) => {
        if (!data.name || !data.roomId) {
            soc.emit('notification', {
                text: "Incorrect input data",
                type: "error"
            })
            return cb("Incorrect input data")
        }

        soc.join(data.roomId)
        data.id = soc.id
        cb(data)
        users.removeUserById(data.id)
        users.add(data)
        
        soc
        .to(data.roomId)
        .emit('notification', {
            text: `User ${data.name} joined`,
            type: "success"
        })
        updateUsersList(data.roomId)
    })

    // messages handlers
    soc.on('message:send', (data, cb) => {
        if (!data.content) {
            return cb("Empty input")
        }
        
        const user = users.getUserById(data.from.id)
        if (user) {
            const roomId = user.roomId
            if (messages[roomId]) {
                messages[roomId].push(data)
            } else {
                messages[roomId] = [data]
            }
            socket.to(roomId).emit('message_list:update', messages[roomId])
        }
        cb(data)
    })
    soc.on('testEvent', (msg) => {
        console.log("[server] test sicket", msg);
      })

    soc.on('message:get', (roomId) => {
        try {
          const existMessages = messages[roomId]
          socket.to(roomId).emit('message_list:update', existMessages?.length ? messages[roomId] : [])
        } catch (e) {
          onError(e)
        }
      })
})



module.exports = {
    app,
    server
}