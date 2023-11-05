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
    deleteFromBlacklist,
    getAllBlacklist
} from '../../../services/blacklist.service';

export default function Blacklist() {
    const navigte = useNavigate();
    const { state, dispatch } = useAppContext();
    const [blacklist, setBlacklist] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'idProduct', headerName: 'Id Product', width: 200 },
        {
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => {
                const handleDelete = async () => {
                    try {
                        await deleteFromBlacklist(params.row.id);
                        getMessasge(
                            'Delete from blacklist successfully',
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
            const data = await getAllBlacklist();
            console.log(data);
            setBlacklist(data);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Blacklist'
            })
        );
    };

    useEffect(() => {
        setData();
        changeTitle('Blacklist');
        changeT();
    }, []);

    return (
        <Box>
            {/* <Box sx={{ textAlign: 'end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigte('/blacklist/add')}
                >
                    Add
                </Button>
            </Box> */}
            <DataGrid
                rows={blacklist}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    }
                }}
                pageSizeOptions={10}
            />
        </Box>
    );
}
