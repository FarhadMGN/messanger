import React, {useState} from "react";
import HeaderComponent from "./header/header.component";
import {Route, Routes} from "react-router";
import AuthComponent from "./auth/auth.components";
import RoomComponent from "./room/room.component";
import "./main.component.css"
import useChat from "../hooks/useChat.hook";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { UserModel } from "../models/user.model";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function MainComponent() {
    const [auth, setAuth] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "",
        roomId: ""
    });
    const [roomId, setRoomId] = useState("");
    const {messages, socket} = useChat();
    const [open, setOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationText, setNotificationText] = useState('');

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
      
    let navigate = useNavigate();


    const logout = () => {
        setAuth(false);
        setRoomId("");
    };

    const login = (loginData: {userName: string, roomId: string}) => {
        // possible need move to useEffect
        socket.on('notification', (notification) => {
            console.log("notification", notification);
            setNotificationType(notification.type)
            setNotificationText(notification.text)
            setOpen(true)
        })
        socket.emit('userJoined', {
            name: loginData.userName,
            roomId: loginData.roomId
        }, (data: any) => {
            if (typeof data === 'string') {
                console.error(data)
            } else {
                setAuth(true);
                const currentUser: UserModel = {
                    name: data.name,
                    id: data.id,
                    roomId: data.roomId
                }
                setCurrentUser(currentUser);
                localStorage.setItem('USER_DATA', JSON.stringify(currentUser))
                setRoomId(data.roomId);
                navigate("/room");
                console.log("loginData", loginData)
            }
        })
    };
    return (
        <>
            <HeaderComponent onLogout={logout} auth={auth} roomId={roomId}/>
            <Routes>
                <Route path="/" element={<>hola</>}/>
                <Route path="/auth" element={
                    <div className="App-header_auth">
                        <AuthComponent onLogin={login}/>
                    </div>
                } />
                <Route path="/room" element={<RoomComponent roomId={roomId} currentUser={currentUser} socket={socket} messages={messages}/>}/>
            </Routes>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={notificationType as AlertColor} sx={{ width: '100%' }}>
                    { notificationText }
                </Alert>
            </Snackbar>
        </>
    )
}

export default MainComponent
