import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { MessageModel } from '../models/message.model'
import { UserModel } from '../models/user.model';

export default function useChat() {
    const [users, setUsers] = useState([])
    
    const [messages, setMessages] = useState([]);
    const [log, setLog] = useState(null)
    const { current: socket } = useRef(
      io('http://localhost:4000')
    )
  
    useEffect(() => {
      socket.on('log', (log) => {
        setLog(log)
      })
  
      socket.on('user_list:update', (users: UserModel[]) => {
        setUsers(users)
      })
  
      socket.on('message_list:update', (messages) => {
        setMessages(messages)
      })
    }, [])
  
    const removeMessage = (message: MessageModel) => {
      socket.emit('message:remove', message)
    }
  
    return { users, messages, log, removeMessage, socket }
  }