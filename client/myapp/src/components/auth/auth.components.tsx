import React, {useState} from "react";
import "./auth.components.css"
import {Button, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'

function AuthComponent(props: any) {
    const { t } = useTranslation();
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");
    const connectToRoom = () => {
        props.onLogin({userName: userName, roomId: roomId})
    };
    return (
        <div className="auth-form">
            <TextField
                className="auth-form-item"
                name="username"
                placeholder="Igor21"
                label={t('auth.component.username')}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
                className="auth-form-item"
                name="roomId"
                placeholder="myTopRoom2000"
                label={t('auth.component.roomId')}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <Button
                onClick={() => connectToRoom()}
                className="auth-form-item__button"
                variant="contained">{t('auth.component.join')}</Button>
        </div>
    )
}

export default AuthComponent;
