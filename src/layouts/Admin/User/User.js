import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

import { useNavigate } from 'react-router-dom';
import {
    apiURL,
    changeTitle,
    getMessasge,
    useAppContext
} from '../../../utils';
import { actions } from '../../../store';
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Slider,
    Typography
} from '@mui/material';
import { getDocumentById } from '../../../services/document.service';
import { getAllCategory } from '../../../services/category.service';
import { addBlacklist } from '../../../services/blacklist.service';
import {
    changeRole,
    getAllUser,
    handleDeleteUser,
    updateUser
} from '../../../services/user.service';

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

export default function Users() {
    const { state, dispatch } = useAppContext();

    const [users, setUsers] = useState([]);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDel, setOpenDel] = React.useState(false);
    // form edit

    const [name, setName] = useState(null);

    // form edit

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const [user, setUser] = useState({});
    const [role, setRole] = useState('user');
    const roles = [
        {
            id: 2,
            name: 'user',
            value: 'user'
        },
        {
            id: 1,
            name: 'admin',
            value: 'admin'
        }
    ];

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'fullName', headerName: 'Tên', width: 300 },
        {
            headerName: 'Actions',
            width: 400,
            renderCell: (params) => {
                const handleEdit = () => {
                    setUser(params.row);
                    setName(params.row.fullName);
                    handleOpenEdit();
                };

                const handleDelete = () => {
                    setUser(params.row);
                    handleOpenDel();
                };

                const handleChangeRole = async (role) => {
                    try {
                        await changeRole(params.row.id, role);
                        getMessasge(
                            `Change role of user ${params.row.fullName} to ${role} successfully`,
                            'success',
                            dispatch,
                            actions,
                            state
                        );
                    } catch (error) {
                        getMessasge(
                            error.message,
                            'error',
                            dispatch,
                            actions,
                            state
                        );
                    }
                };

                return (
                    <div>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={params.row.roles}
                            label="Category"
                            onChange={(e) => handleChangeRole(e.target.value)}
                        >
                            {roles &&
                                roles.map((role) => (
                                    <MenuItem value={role.value}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEdit}
                            sx={{ marginInlineEnd: 1 }}
                        >
                            <ModeEditIcon />
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            sx={{ marginInlineEnd: 1 }}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>
                );
            }
        }
    ];

    const setData = async () => {
        try {
            const data = await getAllUser();
            setUsers(data);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Users'
            })
        );
    };
    useEffect(() => {
        setData();
        changeTitle('Users');
        changeT();
    }, []);

    const handleDelete = async (id) => {
        try {
            await handleDeleteUser(id);
            handleCloseDel();
            getMessasge(
                'Delete document successfully',
                'success',
                dispatch,
                actions,
                state
            );
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const handleEdit = async (id) => {
        try {
            handleCloseEdit();
            await updateUser({ id: id, name: name });
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
        <div>
            <DataGrid
                rows={users}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    }
                }}
                pageSizeOptions={10}
            />
            {/* Modal For Edit */}
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
                                onChange={(e) => setName(e.target.value)}
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
                            onClick={() => handleEdit(user.id)}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Modal For Edit */}

            {/* Modal For Delete */}

            <Modal
                open={openDel}
                onClose={handleCloseDel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Bạn có chắc muốn xoá{' '}
                        <strong>{user && user.fullName}</strong> ?
                    </Typography>
                    <Divider />
                    <Box sx={{ marginLeft: '50%', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            sx={{ marginInlineEnd: 1 }}
                            onClick={handleCloseDel}
                        >
                            No
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(user.id)}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Modal For Delete */}
        </div>
    );
}
