import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import rootStore from '../../store/RootStore';

const LoginForm: React.FC = observer(() => {
    const authStore = rootStore.authStore;
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await authStore.login(username, password);
        if (authStore.isLoggedIn) {
            navigate('/patients');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#c5c5c5',
            }}
        >
            <Card sx={{ bgcolor: '#ffffff' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" align="center" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                        Авторизация
                    </Typography>
                    {authStore.error && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            {authStore.error}
                        </Alert>
                    )}
                    <TextField
                        id="username"
                        label="Имя пользователя"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 4 }}
                    />
                    <TextField
                        id="password"
                        label="Пароль"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{ mb: 4 }}
                    />
                    <Button variant="contained" onClick={handleLogin} fullWidth>
                        Войти
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
});

export default LoginForm;
