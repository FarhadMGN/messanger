import React, {useEffect, useState} from "react";
import r from "../../mock-data/rooms.json"
import "./room.component.css"
import {Button, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {MessageModel} from "../../models/message.model";
import {RoomModel} from "../../models/room.model";
import { UserModel } from "../../models/user.model";


function RoomComponent(props: {roomId: string, currentUser: UserModel, socket: any, messages: MessageModel[]}) {
    // const { users2, messages2, log, sendMessage2, removeMessage, testSend } = useChat()
    
    const { t } = useTranslation();
    const [room, setRoom] = useState();
    const [message, setMessage] = useState("");
    console.log("messages wil be set to", props.messages);
    
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(props.currentUser);

    const sendMessage = () => {
        const m: MessageModel = {
            type: "TEXT",
            content: message,
            from: currentUser
        };
        console.log("mes", m);
        
        // testSend(m)
        if (m.content) {
            props.socket.emit('message:send', m, (data: any) => {
                console.log("message:send client");
                
                if (typeof data === 'string') {
                    console.error(data)
                } 
                setMessage("");
            })
        }
        
    };
    return (
        <div className="room-component">
            <div className="room-component_content">
                <div className="room-component_content__users">
                    {users.map((user) => (
                        <div className="room-component_content__users-user">
                            { user.name + (user.id === currentUser.id ? " (you)" : "")}
                        </div>
                    ))}
                </div>
                <div className="room-component_content__messages">
                    {props.messages.map((message) => (
                        <div className={message.from.id === currentUser.id ?
                            "room-component_content__messages-msg-my" :
                            "room-component_content__messages-msg-other"}>
                            <label className="room-component_content__messages-user">{message.from.name}</label>
                            <div>
                                { message.content }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="room-component_interaction">
                <TextField
                    size="small"
                    className="room-component_interaction__input"
                    name="message"
                    label={t('room.component.inputMessage')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                    onClick={() => sendMessage()}
                    className="room-component_interaction__submit"
                    size="small"
                    variant="contained">{t('room.component.sendMessage')}</Button>
            </div>

        </div>
    )
}

export default RoomComponent;
