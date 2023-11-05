import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Login.css';
import Logo from '../../assets/google-icon.png';
import LogoTDT from '../../assets/tdt-icon.png';
import { signInWithGoogle, useAppContext } from '../../utils';
import { actions } from '../../store';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/bg1.png';

const defaultTheme = createTheme();

export default function Login() {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();
    const checkLogin = () => {
        if (localStorage.getItem('@user')) {
            navigate('/');
        }
    };

    React.useEffect(() => {
        checkLogin();
    }, []);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        // backgroundImage:
                        //     `url(https://source.unsplash.com/random?wallpapers)`,
                        backgroundImage: `url(${logo})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light'
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <img src={LogoTDT} alt="TDT Icon" class="logo" />

                        <Typography
                            component="h1"
                            variant="h2"
                            className="title"
                        >
                            Chia sẻ tài liệu
                        </Typography>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            color="inherit"
                            onClick={() =>
                                signInWithGoogle(
                                    dispatch,
                                    actions,
                                    state,
                                    navigate
                                )
                            }
                        >
                            <img
                                src={Logo}
                                alt="Google Icon"
                                class="google-icon"
                            />{' '}
                            Sign In With Google
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
