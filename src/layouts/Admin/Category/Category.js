import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { useNavigate } from 'react-router-dom';
import { changeTitle, getMessasge, useAppContext } from '../../../utils';
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
import {
    addCategory,
    deleteCategory,
    getAllCategory,
    getDocumentByCategoryId,
    updateCategory
} from '../../../services/category.service';

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

export default function Category() {
    const navigate = useNavigate();
    const { state, dispatch } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [document, setDocument] = useState({});

    const [openEdit, setOpenEdit] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);
    // form edit

    const [name, setName] = useState(null);

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Tên tài liệu', width: 900 },
        {
            headerName: 'Actions',
            width: 500,
            renderCell: (params) => {
                const handleEdit = () => {
                    setDocument(params.row);
                    setName(params.row.name);
                    handleOpenEdit();
                };

                const handleDelete = async () => {
                    try {
                        await deleteCategory(params.row.id);
                        getMessasge(
                            'Delete category successfully!',
                            'success',
                            dispatch,
                            actions,
                            state
                        );
                        setData();
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

                const handleView = async () => {
                    try {
                        const data = await getDocumentByCategoryId(
                            params.row.id
                        );
                        dispatch(
                            actions.setData({
                                ...state.set,
                                documentsCategory: data
                            })
                        );
                        navigate('/documents/category/' + params.row.id);
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
                            onClick={handleDelete}
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
            const data = await getAllCategory();
            setCategories(data);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };
    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Category'
            })
        );
    };

    useEffect(() => {
        setData();
        changeT();
        changeTitle('Category');
    }, []);

    const handleEdit = async (id) => {
        try {
            handleCloseEdit();
            await updateCategory({ id, name });
            getMessasge(
                'Update category successfully',
                'success',
                dispatch,
                actions,
                state
            );
            setData();
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const handleAdd = async () => {
        try {
            await addCategory(name);
            getMessasge(
                'Added new Category',
                'success',
                dispatch,
                actions,
                state
            );
            handleCloseAdd();
            setName(null);
            setData();
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    return (
        <div>
            <Box sx={{ textAlign: 'end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="info"
                    onClick={handleOpenAdd}
                >
                    Add
                </Button>
            </Box>
            <DataGrid
                rows={categories}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    }
                }}
                pageSizeOptions={[5, 10, 25]}
            />
            {/* edit modal */}
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

            {/* edit modal */}

            {/* add modal */}
            <Modal
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Thêm loại tài liệu mới
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
                            onClick={handleCloseAdd}
                        >
                            No
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleAdd}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* add modal */}
        </div>
    );
}
