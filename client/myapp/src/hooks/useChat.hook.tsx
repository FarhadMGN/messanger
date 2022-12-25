import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { MessageModel } from '../models/message.model'

export default function useChat() {
    const [users2, setUsers] = useState([])
    
    const [messages, setMessages] = useState([]);
    const [log, setLog] = useState(null)
    // const opt = {
    //     query: {
    //       roomId: user?.roomId,
    //       userName: user?.name
    //     }
    //   }
    const { current: socket } = useRef(
      io('http://localhost:4000')
    )
    console.log("on io")
  
    useEffect(() => {
      socket.on('log', (log) => {
        setLog(log)
      })

    //   socket.on('message:add', (data: any) => {
    //     console.log("message:add use effect", messages, data)
  
    //   socket.on('user_list:update', (users) => {
    //     setUsers(users)
    //   })
  
      socket.on('message_list:update', (messages) => {
        console.log("[HOOK] messages", messages);
        setMessages(messages)
      })
    }, [])
  
    // const sendMessage = (message: MessageModel) => {
    //   socket.emit('message:send', message)
    // }
  
    const removeMessage = (message: MessageModel) => {
      socket.emit('message:remove', message)
    }

    // const testSend = (message: MessageModel) => {
    //   socket.emit('testEvent', message)
    // }
  
    return { users2, messages, log, removeMessage, socket }
  }