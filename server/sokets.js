// const app = require('express')();
// const http = require('http').createServer(app);

const { createServer } = require('http')
const express = require("express")
const io = require("socket.io")
const {ALLOWED_ORIGIN} = require("./server-const")
const cors = require('cors')
const { join } = require('path')

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
        cb(data)
        // soc.emit('notification', {
        //     text: `User ${data.name} joined`,
        //     type: "success"
        // })
        soc.broadcast
        .to(data.roomId)
        .emit('notification', {
            text: `User ${data.name} joined`,
            type: "success"
        })
        
    })
    console.log("[server] on connection")
    // const { roomId, userName } = soc.handshake.query
    // console.log("[server] roomId", roomId);
    // console.log("[server] userName", userName);

    soc.on('message:add', (data, cb) => {
        if (!data.content) {
            return cb("Empty input")
        }
        data.content = data.content + " server"
        cb(data)
        console.log("[server] add message", data);
    })
    soc.on('testEvent', (msg) => {
        console.log("[server] test sicket", msg);
      })
})



module.exports = {
    app,
    server
}