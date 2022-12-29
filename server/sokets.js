const { createServer } = require('http')
const express = require("express")
const io = require("socket.io")
const {ALLOWED_ORIGIN} = require("./server-const")
const cors = require('cors')
const users = require('./users')()
const messages = {}
const roomUserCount = {}
const roomsPassword = {}


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
        if (!data.name || !data.roomId || !data.password) {
            soc.emit('notification', {
                text: "Incorrect input data",
                type: "error"
            })
            return cb("Incorrect input data")
        }

        data.id = soc.id
        const currentUsers = users.getByRoom(data.roomId);
        if (currentUsers?.length === 0) {
            roomsPassword[data.roomId] = data.password
            soc.join(data.roomId)
            data.status = "ROOM_ADMIN"
            users.add(data)
            cb(data)
            soc.emit('notification', {
                text: `Please specify maximum count of users for ${data.roomId} room.`,
                type: "info"
            })
            updateUsersList(data.roomId)
            return;
        }
        if (roomUserCount[data.roomId] && currentUsers?.length + 1 > roomUserCount[data.roomId]) {
            soc.emit('notification', {
                text: "The number of users has been exceeded, please create a new room or contact the administrator",
                type: "error"
            })
            return cb("The number of users has been exceeded, please create a new room or contact the administrator")
        }
        if (roomsPassword[data.roomId] === data.password) {
            soc.join(data.roomId)
            users.removeUserById(data.id)
            users.add(data)
            cb(data)

            soc
            .to(data.roomId)
            .emit('notification', {
                text: `User ${data.name} joined`,
                type: "success"
            })
            updateUsersList(data.roomId)
        } else {
            soc.emit('notification', {
                text: "Incorrect password",
                type: "error"
            })
            return cb("Incorrect password")
        }
    })

    soc.on('userNumber:update', (data) => {
        roomUserCount[data.roomId] = data.count
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