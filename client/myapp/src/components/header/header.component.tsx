import React from "react";
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import i18n from "../../i18n"
import TranslateIcon from '@mui/icons-material/Translate';
import {AccountCircle} from "@mui/icons-material";
import {useNavigate} from "react-router";

function HeaderComponent(props: {roomId: string, auth: any, onLogout: any}) {
    const { t } = useTranslation();
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [userEl, setUserEl] = React.useState<null | HTMLElement>(null);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setUserEl(null);
    };

    const leaveRoom = () => {
        setUserEl(null);
        // sessionStorage.delete('access)token');
        props.onLogout();
        navigate("/auth");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {t('appname') + " " + props.roomId}
                </Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <TranslateIcon/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem selected={i18n.language === 'ru'} onClick={() => changeLanguage("ru")}>{t('locale.russian')}</MenuItem>
                    <MenuItem selected={i18n.language === 'en'} onClick={() => changeLanguage("en")}>{t('locale.english')}</MenuItem>
                </Menu>
                {props.auth && (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleUserMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={userEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(userEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={leaveRoom}>Leave room</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default HeaderComponent;
