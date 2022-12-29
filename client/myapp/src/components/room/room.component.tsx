import {useState} from "react";
import "./room.component.css"
import {Button, MenuItem, TextField, Tooltip} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useTranslation} from "react-i18next";
import {MessageModel} from "../../models/message.model";
import { UserModel } from "../../models/user.model";
import QuizIcon from '@mui/icons-material/Quiz';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';


function RoomComponent(props: {roomId: string, currentUser: UserModel, socket: any, messages: MessageModel[], users: UserModel[]}) {  
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [answer, setAnswer] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [userNumber, setUserNumber] = useState(2);

    const sendMessage = (messageContent: string) => {
        const m: MessageModel = {
            type: "TEXT",
            content: messageContent,
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

    const sendQuestion = async () => {
        setIsSending(true);
        const url = `https://jservice.io/api/random?count=${1}`
        const params = {
            method: "get",
            headers: {
                 "Access-Control-Allow-Origin": "*",
                 "ContentType": "text/html",
                 "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS"
            }
        }
        let response = await fetch(url, params as any);

        if (response.ok) {
            let question = await response.json();
            const content = question[0].question + "?";
            sendMessage(content);
            const answ = question[0].answer;
            setAnswer(answ);
            setIsSending(false);
          } else {
            console.log("Ошибка HTTP: ", response.status);
            setIsSending(false);
          }
    }

    const sendAnswer = () => {
        const m: MessageModel = {
            type: "ANSWER",
            content: answer,
            from: props.currentUser
        };

        props.socket.emit('message:send', m, (data: any) => {
            console.log("message:send client");
            
            if (typeof data === 'string') {
                console.error(data)
            } 
            setAnswer("");
        })
    }

    const handleUserNumberChange = (num: number | string) => {
        console.log(num);
        const data = {
            roomId: props.roomId,
            count: num
        }
        props.socket.emit('userNumber:update', data)
        setUserNumber(num as number)
    }

    return (
        <div className="room-component">
            <div className="room-component_content">
                <div className="room-component_content__users">
                    {props.currentUser.status === "ROOM_ADMIN" ? 
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={userNumber}
                        label="User count"
                        onChange={(e) => handleUserNumberChange(e.target.value)}
                    >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                    </Select>
                    : null}
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
                <Tooltip title="Send random question">
                    <QuizIcon color={isSending ? 'secondary' : 'primary'} onClick={() => sendQuestion()}/>
                </Tooltip>
                {
                    answer ?
                    <Tooltip title="Send last question answer">
                        <QuestionAnswerIcon color={'primary'} onClick={() => sendAnswer()}/>
                    </Tooltip> :
                    null
                }
                <Button
                    onClick={() => sendMessage(message)}
                    className="room-component_interaction__submit"
                    size="small"
                    variant="contained">{t('room.component.sendMessage')}</Button>
            </div>

        </div>
    )
}

export default RoomComponent;
