import React, {useState} from "react";
import "./auth.components.css"
import {Button, IconButton, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'
import { Visibility, VisibilityOff } from "@mui/icons-material";

function AuthComponent(props: any) {
    const { t } = useTranslation();
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const connectToRoom = () => {
        props.onLogin({userName: userName, roomId: roomId, password})
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
            <OutlinedInput
                placeholder="Password"
                className="auth-form-item"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                <InputAdornment 
                position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
                name="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                onClick={() => connectToRoom()}
                className="auth-form-item__button"
                variant="contained">{t('auth.component.join')}</Button>
        </div>
    )
}

export default AuthComponent;
