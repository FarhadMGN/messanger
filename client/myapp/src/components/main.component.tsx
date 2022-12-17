import React, {useState} from "react";
import HeaderComponent from "./header/header.component";
import {Route, Routes} from "react-router";
import AuthComponent from "./auth/auth.components";
import RoomComponent from "./room/room.component";
import "./main.component.css"

function MainComponent() {
    const [auth, setAuth] = useState(false);
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");

    const logout = () => {
        setAuth(false);
        setRoomId("");
    };

    const login = (loginData: {userName: string, roomId: string}) => {
        setAuth(true);
        setUserName(loginData.userName);
        setRoomId(loginData.roomId);
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
                <Route path="/room" element={<RoomComponent roomId={roomId} userName={userName}/>}/>
            </Routes>
        </>
    )
}

export default MainComponent
