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


socket.on('connection', (soc) => {
    soc.on('userJoined', (data, cb) => {
        console.log("data", data);
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
        
        soc.broadcast
        .to(data.roomId)
        .emit('notification', {
            text: `User ${data.name} joined`,
            type: "success"
        })
        
    })
    console.log("[server] on connection")

    soc.on('message:send', (data, cb) => {
        // console.log("message:send server");
        if (!data.content) {
            return cb("Empty input")
        }
        // for debug
        data.content = data.content + " server"
        const user = users.getUserById(data.from.id)
        // console.log("user",user);
        if (user) {
            console.log("message:add server", user);
            // soc.to(user.roomId).emit('message:add', data);
            const roomId = user.roomId
            if (messages[roomId]) {
                messages[roomId].push(data)
            } else {
                messages[roomId] = [data]
            }
            soc.to(roomId).emit('message_list:update', messages[roomId])
            console.log("   >>messages[roomId]", messages[roomId]);
        }
        cb(data)
        // console.log("[server] add message", data);
    })
    soc.on('testEvent', (msg) => {
        console.log("[server] test sicket", msg);
      })

    soc.on('message:get', (roomId) => {
        try {
          soc.to(roomId).emit('message_list:update', messages[roomId])
        } catch (e) {
          onError(e)
        }
      })
})



module.exports = {
    app,
    server
}