import {
    Box,
    Divider,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Button
} from '@mui/material';
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import { changeTitle, getMessasge, useAppContext } from '../../../utils';
import { getAllCategory } from '../../../services/category.service';
import { actions } from '../../../store';
import { UploadFile, UploadFileSharp } from '@mui/icons-material';
import { uploadDocument } from '../../../services/document.service';
import { TextareaAutosize } from '@mui/base';

const style = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

export default function Upload() {
    const { state, dispatch } = useAppContext();

    const [categories, setCategories] = useState(null);

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isPrivate, setPrivate] = useState(null);
    const [category, setCategory] = useState(null);
    const [file, setFile] = useState(null);

    const getData = async () => {
        try {
            const resultfindAllCategories = await getAllCategory();

            setCategories(resultfindAllCategories);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };
    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Upload'
            })
        );
    };

    useEffect(() => {
        getData();
        changeTitle('Upload');
        changeT();
    }, []);

    const handleUpload = async () => {
        try {
            await uploadDocument({
                name,
                description,
                file,
                category,
                isPrivate
            });
            getMessasge(
                'Upload document successfully',
                'success',
                dispatch,
                actions,
                state
            );
            setName('');
            setDescription('');
            setFile(null);
            setCategory(null);
            setPrivate(null);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    return (
        <Grid container>
            <Grid lg={3} sx={12}></Grid>
            <Grid lg={6} xs={12}>
                <Box sx={style}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h2"
                            sx={{ textAlign: 'center' }}
                        >
                            <UploadFile /> Upload
                        </Typography>
                    </Box>
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
                                accept=".pdf,.doc,.docx,.xlsx,.pptx,.ppt" // Add accepted file formats
                                onChange={(event) =>
                                    setFile(event.target.files[0])
                                }
                            />
                        </FormControl>
                        <Divider />
                        <FormControl fullWidth sx={{ mt: 5 }}>
                            <Button
                                startIcon={<UploadFileSharp />}
                                variant="contained"
                                color="primary"
                                onClick={handleUpload}
                            >
                                Upload
                            </Button>
                        </FormControl>
                    </Box>
                </Box>
            </Grid>
            <Grid lg={3} sx={12}></Grid>
        </Grid>
    );
}
