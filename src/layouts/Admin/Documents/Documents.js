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
import {
    deleteDocument,
    getAllDocuments,
    getAllDocumentsAndBlacklist,
    getDocumentById,
    updateDocument
} from '../../../services/document.service';
import { getAllCategory } from '../../../services/category.service';
import { addBlacklist } from '../../../services/blacklist.service';
import { TextareaAutosize } from '@mui/base';

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

export default function Documents() {
    const navigate = useNavigate();
    const { state, dispatch } = useAppContext();

    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState(null);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDel, setOpenDel] = React.useState(false);
    const [openBlack, setOpenBlack] = React.useState(false);

    // form edit

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isPrivate, setPrivate] = useState(null);
    const [category, setCategory] = useState(null);
    const [file, setFile] = useState(null);

    // form edit

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const handleOpenBlack = () => setOpenBlack(true);
    const handleCloseBlack = () => setOpenBlack(false);

    const [document, setDocument] = useState({});

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Tên tài liệu', width: 400 },
        { field: 'description', headerName: 'Mô tả', width: 700 },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            type: 'number',
            width: 90
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
                    setDocument(params.row);
                    handleOpenDel();
                };

                const handleView = async () => {
                    try {
                        const data = await getDocumentById(params.row.id);
                        dispatch(
                            actions.setData({
                                ...state.set,
                                documentChoose: data
                            })
                        );
                        navigate('/documents/' + params.row.id);
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

                const handleBlacklist = async () => {
                    setDocument(params.row);
                    handleOpenBlack();
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
                            sx={{ marginInlineEnd: 1 }}
                        >
                            <DeleteIcon />
                        </Button>
                        {!params.row.isBlacklisted && (
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={handleBlacklist}
                            >
                                <FilterListOffIcon />
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ];

    const setData = async () => {
        try {
            const data = await getAllDocumentsAndBlacklist();
            const resultfindAllCategories = await getAllCategory();

            setDocuments(data);
            setCategories(resultfindAllCategories);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Documents'
            })
        );
    };
    useEffect(() => {
        setData();
        changeTitle('Documents');
        changeT();
    }, []);

    const handleAddBlacklist = async (id) => {
        try {
            handleCloseBlack();
            await addBlacklist(id);
            getMessasge(
                'Added to Blacklist',
                'success',
                dispatch,
                actions,
                state
            );
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

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

    return (
        <div>
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
                            <label
                                style={{ color: '#666666', marginLeft: 15 }}
                                htmlFor="description"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={3} // Set the desired number of rows
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    padding: 10,
                                    resize: 'none',
                                    width: '100%',
                                    fontSize: 18,
                                    borderRadius: 10
                                }}
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
                            <label
                                style={{ color: '#666666', marginLeft: 15 }}
                                htmlFor="description"
                            >
                                File
                            </label>
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

            {/* Modal For Blacklist */}

            <Modal
                open={openBlack}
                onClose={handleCloseBlack}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Bạn có chắc muốn thêm tài liệu vào blacklist{' '}
                        <strong>{document && document.name}</strong>
                    </Typography>
                    <Divider />
                    <Box sx={{ marginLeft: '50%', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            sx={{ marginInlineEnd: 1 }}
                            onClick={handleCloseBlack}
                        >
                            No
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleAddBlacklist(document.id)}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Modal For Blacklist */}
        </div>
    );
}
