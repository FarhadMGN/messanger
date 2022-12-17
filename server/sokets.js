// const app = require('express')();
// const http = require('http').createServer(app);

const { createServer } = require('http')
const express = require("express")
const io = require("socket.io")
const {ALLOWED_ORIGIN} = require("./server-const")
const cors = require('cors')

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
    console.log("[server] on connection")
    const { roomId, userName } = soc.handshake.query
    console.log("[server] roomId", roomId);
    console.log("[server] userName", userName);
    soc.on('testEvent', (msg) => {
        console.log("[server] test sicket", msg);
      })
})



module.exports = {
    app,
    server
}