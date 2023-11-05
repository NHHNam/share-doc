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

export default function ListDocumentCategory() {
    const { state, dispatch } = useAppContext();
    const [listDocuments, setDocuments] = useState([]);
    const navigate = useNavigate();

    const setData = () => {
        setDocuments(state.set.documentsPublic);
    };
    useEffect(() => {
        setData();
    }, []);

    console.log(listDocuments);

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
                                            // style={{
                                            //     wordWrap: 'break-word',
                                            //     overflow: 'hidden',
                                            //     textOverflow: 'ellipsis',
                                            //     display: '-webkit-box',
                                            //     WebkitLineClamp: 3, // Number of lines to display before truncating
                                            //     WebkitBoxOrient: 'vertical'
                                            // }}
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
        </div>
    );
}
