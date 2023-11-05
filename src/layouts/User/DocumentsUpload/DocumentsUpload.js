import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import { changeTitle, getMessasge, useAppContext } from '../../../utils';
import { actions } from '../../../store';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
    deleteDocument,
    getDocumentsByUserId,
    shareToUser,
    updateDocument
} from '../../../services/document.service';
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    Input,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Modal,
    Select,
    Slider,
    Typography,
    Checkbox
} from '@mui/material';
import { getAllCategory } from '../../../services/category.service';
import { Share } from '@mui/icons-material';
import { getAllUser, searchUser } from '../../../services/user.service';

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

export default function DocumentsUpload() {
    const navigate = useNavigate();
    const { state, dispatch } = useAppContext();

    const [categories, setCategories] = useState(null);
    const [userSearchText, setUserSearchText] = useState('');
    const [userSearchStore, setUserSearchStore] = useState([]);

    const [documents, setDocuments] = useState([]);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDel, setOpenDel] = React.useState(false);
    const [openShare, setOpenShare] = React.useState(false);

    // form edit

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isPrivate, setPrivate] = useState(null);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [category, setCategory] = useState(null);
    const [file, setFile] = useState(null);

    // form edit

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const handleOpenShare = () => setOpenShare(true);
    const handleCloseShare = () => setOpenShare(false);

    const [document, setDocument] = useState({});

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Tên tài liệu', width: 400 },
        { field: 'description', headerName: 'Mô tả', width: 700 },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            type: 'number',
            width: 100
        },
        {
            headerName: 'Actions',
            width: 400,
            renderCell: (params) => {
                const handleEdit = () => {
                    setDocument(params.row);
                    setName(params.row.name);
                    setDescription(params.row.description);
                    setPrivate(params.row.isPrivate);
                    setCategory(params.row.categoryId);
                    handleOpenEdit();
                };

                const handleDelete = () => {
                    // Handle delete action
                    // You can use the ID from params.row.id to identify the document
                    setDocument(params.row);
                    handleOpenDel();
                };

                const handleView = () => {
                    dispatch(
                        actions.setData({
                            ...state.set,
                            documentChoose: params.row
                        })
                    );
                    navigate('/documents/' + params.row.id);
                };

                const handleShare = () => {
                    setDocument(params.row);
                    handleOpenShare();
                };

                return (
                    <div>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleView}
                            sx={{ marginInlineEnd: 1 }}
                        >
                            <RemoveRedEyeIcon />
                        </Button>

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
                            sx={{ marginInlineEnd: 1 }}
                            onClick={handleDelete}
                        >
                            <DeleteIcon />
                        </Button>

                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleShare}
                        >
                            <Share />
                        </Button>
                    </div>
                );
            }
        }
    ];

    const getData = async () => {
        try {
            const dataDocuments = await getDocumentsByUserId(
                localStorage.getItem('id')
            );
            const resultfindAllCategories = await getAllCategory();
            const resultAllUsers = await getAllUser();
            const userFilter = resultAllUsers.filter(
                (user) => user.id !== parseInt(localStorage.getItem('id'))
            );

            setDocuments(dataDocuments);
            setUsers(userFilter);
            setUserSearchStore(userFilter);
            setCategories(resultfindAllCategories);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const checkLogin = () => {
        if (!localStorage.getItem('@user')) {
            navigate('/login');
        }
    };

    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Documents Upload'
            })
        );
    };

    useEffect(() => {
        checkLogin();
        changeTitle('Documents Upload');
        changeT();
        getData();
    }, []);

    const handleDelete = async (id) => {
        try {
            handleCloseDel();
            await deleteDocument(id);
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
            await updateDocument({
                name,
                description,
                category,
                isPrivate,
                file,
                id
            });
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

    const handleChangeTextSearch = async (e) => {
        setUserSearchText(e.target.value);
        try {
            if (e.target.value.length > 0) {
                const data = users.filter(
                    (user) =>
                        user.fullName
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                        user.email
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                );
                setUserSearchStore(data);
            } else {
                setUserSearchStore(users);
            }
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const handleCheckboxChange = (name) => (event) => {
        setUser((prevCheckboxes) => ({
            ...prevCheckboxes,
            [name]: event.target.checked
        }));
    };

    const handleShare = async (id) => {
        handleCloseShare();
        const checkboxValues = Object.keys(user).map((key) => ({
            idUser: key,
            chose: user[key]
        }));

        const result = checkboxValues.filter((item) => item.chose === true);
        setUser({});
        try {
            result.forEach(async (user) => {
                await shareToUser(id, user.idUser);
            });
            getMessasge(
                'Đã share tài liệu cho các người dùng được chọn thành công',
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
        <div style={{ width: '100%' }}>
            <DataGrid
                rows={documents}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    }
                }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
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
                        Edit <strong>{document && document.name}</strong>
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

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">
                                Description
                            </InputLabel>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 5 }}>
                            <InputLabel id="demo-simple-select-label">
                                Private
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={isPrivate}
                                label="Private"
                                onChange={(e) => setPrivate(e.target.value)}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 5 }}>
                            <InputLabel id="demo-simple-select-label">
                                Category
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories &&
                                    categories.map((category) => (
                                        <MenuItem value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 5 }}>
                            <input
                                style={{
                                    border: '1px solid #ccc', // Add border or customize as needed
                                    padding: '10px', // Adjust padding as needed
                                    borderRadius: '5px', // Add border radius or customize as needed
                                    backgroundColor: '#f9f9f9', // Adjust background color as needed
                                    color: '#333'
                                }}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt" // Add accepted file formats
                                onChange={(event) =>
                                    setFile(event.target.files[0])
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
                            onClick={() => handleEdit(document.id)}
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
                        Delete <strong>{document && document.name}</strong>
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
                            onClick={() => handleDelete(document.id)}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Modal For Delete */}

            {/* Modal for shared */}

            <Modal
                open={openShare}
                onClose={handleCloseShare}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Share <strong>{document && document.name}</strong>
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 5 }}>
                        <Typography
                            id="sandwich-group"
                            variant="body1"
                            fontWeight="bold"
                            mb={1}
                        >
                            Users to share:
                        </Typography>
                        <Input
                            value={userSearchText}
                            onChange={handleChangeTextSearch}
                            placeholder="Nhập từ để tìm kiếm"
                        />
                        <List size="small">
                            {userSearchStore &&
                                userSearchStore.map((user) => (
                                    <ListItem>
                                        <label>
                                            <Checkbox
                                                name="lettuce"
                                                // checked={user.id}
                                                onChange={handleCheckboxChange(
                                                    user.id
                                                )}
                                            />
                                            {user.fullName} - {user.email}
                                        </label>
                                    </ListItem>
                                ))}
                        </List>
                    </FormControl>

                    <Divider />
                    <Box sx={{ marginLeft: '50%', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            sx={{ marginInlineEnd: 1 }}
                            onClick={handleCloseShare}
                        >
                            No
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleShare(document.id)}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal for shared */}
        </div>
    );
}
