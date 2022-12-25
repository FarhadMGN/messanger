import {useState} from "react";
import "./room.component.css"
import {Button, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {MessageModel} from "../../models/message.model";
import { UserModel } from "../../models/user.model";


function RoomComponent(props: {roomId: string, currentUser: UserModel, socket: any, messages: MessageModel[], users: UserModel[]}) {  
    const { t } = useTranslation();
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        const m: MessageModel = {
            type: "TEXT",
            content: message,
            from: props.currentUser
        };
        
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
                    {props.users.map((user) => (
                        <div className={user.id === props.currentUser.id ? "room-component_content__users-user__my" :"room-component_content__users-user"}>
                            { user.name}
                        </div>
                    ))}
                </div>
                <div className="room-component_content__messages">
                    {props.messages.map((message) => (
                        <div className={message.from.id === props.currentUser.id ?
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
