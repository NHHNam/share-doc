import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    FormControl,
    Grid,
    Input,
    InputLabel,
    Modal,
    Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { changeTitle, getMessasge, useAppContext } from '../../../utils';
import { actions } from '../../../store';
import { getUserById, updateUser } from '../../../services/user.service';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};
export default function Profile() {
    const { state, dispatch } = useAppContext();
    const [user, setUser] = React.useState(null);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDel, setOpenDel] = React.useState(false);
    // form edit

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const [name, setName] = React.useState(null);

    const changeTitleForPage = () => {
        changeTitle('Profile');
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Profile'
            })
        );
    };

    const getUser = async () => {
        const user = state.set.info;
        setUser(user);
        console.log(user);
    };

    useEffect(() => {
        changeTitleForPage();
        getUser();
    }, []);

    const getUserInformation = async () => {
        try {
            const data = await getUserById(localStorage.getItem('id'));
            dispatch(
                actions.setData({
                    ...state.set,
                    info: {
                        ...state.set.info,
                        name: data.fullName
                    }
                })
            );
            setUser({
                ...user,
                name: localStorage.getItem('@name')
            });
        } catch (error) {}
    };

    const handleEdit = async () => {
        try {
            handleCloseEdit();
            await updateUser({ id: localStorage.getItem('id'), name: name });
            await getUserInformation();
            localStorage.setItem('@name', name);
            getMessasge(
                'Edit document successfully',
                'success',
                dispatch,
                actions,
                state
            );
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    return (
        <Grid container>
            <Grid lg={3} xs={12} item></Grid>
            {user && (
                <Grid lg={6} xs={12} item>
                    <Card sx={{ width: '100%' }}>
                        <CardMedia
                            sx={{ height: 300 }}
                            image={localStorage.getItem('@picture')}
                            title="Image profile user"
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {localStorage.getItem('@name')}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setName(localStorage.getItem('@name'));
                                    handleOpenEdit();
                                }}
                            >
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                    <Modal
                        open={openEdit}
                        onClose={handleCloseEdit}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                            >
                                Edit <strong>{user && user.fullName}</strong>
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <FormControl sx={{ mt: 2 }} fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Name
                                    </InputLabel>
                                    <Input
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </FormControl>
                            </Box>
                            <Divider />
                            <Box sx={{ marginLeft: '50%', marginTop: 2 }}>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    sx={{ marginInlineEnd: 1 }}
                                    onClick={handleCloseEdit}
                                >
                                    No
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleEdit}
                                >
                                    Yes
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Grid>
            )}

            <Grid lg={3} xs={12} item></Grid>
        </Grid>
    );
}
