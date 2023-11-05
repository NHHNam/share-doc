import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { changeTitle, getMessasge, useAppContext } from '../../../utils';
import { actions } from '../../../store';
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import { getListDocumentsPublicByCategtory } from '../../../services/category.service';
import './Dashboard.css';

export default function Dashboard() {
    const navigte = useNavigate();
    const { state, dispatch } = useAppContext();
    const [listDocuments, setListDocuments] = useState([]);

    const checkLogin = () => {
        if (!localStorage.getItem('@user')) {
            navigte('/login');
        }
    };

    const getData = async () => {
        try {
            const dataProductsPublic =
                await getListDocumentsPublicByCategtory();

            setListDocuments(dataProductsPublic);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Dashboard'
            })
        );
    };

    useEffect(() => {
        checkLogin();
        changeTitle('Dashboard');
        changeT();
        getData();
    }, []);

    const handleViewDocuments = (products) => {
        dispatch(
            actions.setData({
                ...state.set,
                documentsPublic: products
            })
        );
        navigte('/documents/public');
    };

    return (
        <Grid container spacing={2}>
            {listDocuments &&
                listDocuments.map((category) => (
                    <Grid item lg={4} xs={12}>
                        <Card>
                            <CardActionArea
                                onClick={() =>
                                    handleViewDocuments(category.products)
                                }
                            >
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        {category.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {category.products.length}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    );
}
