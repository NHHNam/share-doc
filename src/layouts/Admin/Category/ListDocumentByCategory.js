import React, { useEffect, useState } from 'react';
import { getMessasge, useAppContext } from '../../../utils';
import { actions } from '../../../store';
import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDocumentById } from '../../../services/document.service';

export default function ListDocumentByCategory() {
    const { state, dispatch } = useAppContext();
    const [listDocuments, setDocuments] = useState([]);
    const navigate = useNavigate();

    const setData = () => {
        setDocuments(state.set.documentsCategory);
    };
    useEffect(() => {
        setData();
    }, []);

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

    return (
        <div>
            <Grid container spacing={2}>
                {listDocuments &&
                    listDocuments.map((document) => (
                        <Grid item lg={4} xs={12}>
                            <Card>
                                <CardActionArea
                                    onClick={() => viewFile(document)}
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
                                        >
                                            {document.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
}
