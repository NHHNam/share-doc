import { Box, Button, Grid, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import './styles.css';
import { getMessasge, useAppContext } from '../../utils';
import { actions } from '../../store';
import { addComment } from '../../services/comment.service';
import { getDocumentById } from '../../services/document.service';
export default function AddCommentComp({ id }) {
    const [comment, setComment] = useState(null);
    const { dispatch, state } = useAppContext();

    const setData = async () => {
        try {
            const data = await getDocumentById(id);
            dispatch(
                actions.setData({
                    ...state,
                    documentChoose: data
                })
            );
        } catch (error) {
            getMessasge(error.message, 'erorr', dispatch, actions, state);
        }
    };

    const pushComment = async () => {
        try {
            await addComment({ id, name: comment });
            getMessasge('Added comment', 'success', dispatch, actions, state);
            await setData();
            setComment(null);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    return (
        <Grid container spacing={2} mt={3}>
            <Grid item lg={12} xs={12}>
                <Grid container lg={12} xs={12}>
                    <Grid item lg={9} xs={12}>
                        <TextareaAutosize
                            minRows={2}
                            style={{
                                width: '100%',
                                resize: 'none',
                                borderRadius: 10
                            }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        xs={12}
                        marginY={1}
                        style={{ textAlign: 'center' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={pushComment}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
