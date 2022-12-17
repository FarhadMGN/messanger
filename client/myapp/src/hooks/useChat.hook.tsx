import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { MessageModel } from '../models/message.model'

export default function useChat() {
    // const user = storage.get(USER_KEY)
    const [users2, setUsers] = useState([])
    const [messages2, setMessages] = useState([])
    const [log, setLog] = useState(null)
    const { current: socket } = useRef(
      io('http://localhost:4000')
    )
    console.log("on io")
  
    useEffect(() => {
    //   socket.emit('user:add', user)
  
    //   socket.emit('message:get')
  
      socket.on('log', (log) => {
        setLog(log)
      })
  
    //   socket.on('user_list:update', (users) => {
    //     setUsers(users)
    //   })
  
    //   socket.on('message_list:update', (messages) => {
    //     setMessages(messages)
    //   })
    }, [])
  
    const sendMessage2 = (message: MessageModel) => {
      socket.emit('message:add', message)
    }
  
    const removeMessage = (message: MessageModel) => {
      socket.emit('message:remove', message)
    }

    const testSend = (message: MessageModel) => {
      socket.emit('testEvent', message)
    }
  
    return { users2, messages2, log, sendMessage2, removeMessage, testSend, socket }
  }