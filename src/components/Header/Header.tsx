import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/RootStore.ts';

const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const Header: React.FC = observer(() => {
    const authStore = rootStore.authStore;

    // Функция для выхода из системы
    const handleLogout = async () => {
        try {
            await authStore.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static" >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, fontWeight: 'bold' }}
                        >
                            МНСК
                        </Typography>
                        <HealthAndSafetyIcon sx={{ marginLeft: 1 }} />
                    </Box>
                    <Box >
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleLogout} // Вызываем функцию выхода при нажатии на кнопку
                                sx={{ fontWeight: 'bold' }}
                            >
                                Выход
                            </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
});

export default Header;
