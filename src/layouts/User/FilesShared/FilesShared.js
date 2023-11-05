import {
    Box,
    CardActionArea,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { getMessasge, useAppContext } from '../../../utils';
import {
    getDocumentById,
    getDocumentsSharedByUserid
} from '../../../services/document.service';
import { actions } from '../../../store';
import { useNavigate } from 'react-router-dom';

export default function FilesShared() {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);

    const viewFile = async (data) => {
        try {
            const res = await getDocumentById(data.id);
            dispatch(
                actions.setData({
                    ...state.set,
                    documentChoose: res
                })
            );
            navigate('/documents/' + data.id);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const getData = async () => {
        try {
            const data = await getDocumentsSharedByUserid(
                localStorage.getItem('id')
            );
            setDocuments(data);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Grid container spacing={2}>
            {documents &&
                documents.map((document) => (
                    <Grid item lg={4} xs={12}>
                        <Card>
                            <CardActionArea
                                onClick={() => viewFile(document)}
                                style={{ height: 300 }}
                            >
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        {document.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                    >
                                        {document.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    );
}
