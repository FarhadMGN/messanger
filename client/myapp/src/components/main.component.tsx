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

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function MainComponent() {
    const [auth, setAuth] = useState(false);
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");
    const {socket} = useChat();
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
                setUserName(loginData.userName);
                setRoomId(loginData.roomId);
                navigate("/room");
            }
        })
        console.log("loginData", loginData)
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
                <Route path="/room" element={<RoomComponent roomId={roomId} userName={userName} socket={socket}/>}/>
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
