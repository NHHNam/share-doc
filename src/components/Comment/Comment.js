import { Box, Divider, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { commentPostedTime, getMessasge, useAppContext } from '../../utils';
import './Comment.css';
import { actions } from '../../store';
import { getUserById } from '../../services/user.service';

export default function Comment({ data }) {
    const { dispatch, state } = useAppContext();

    const [comments, setComments] = useState(null);

    const setData = async () => {
        try {
            if (data) {
                const datamap = await Promise.all(
                    data.map(async (doc) => {
                        const data = await getUserById(doc.userId);
                        return {
                            ...doc,
                            userData: data
                        };
                    })
                );
                setComments(datamap);
            }
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    useEffect(() => {
        setData();
    }, []);

    return (
        <Grid container spacing={2} margin={1}>
            {comments &&
                comments
                    .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((value) => {
                        const timestamp = Date.parse(value.createdAt);
                        const timeInMilliseconds = Date.now() - timestamp; // Calculate the time difference in milliseconds
                        const timeString =
                            commentPostedTime(timeInMilliseconds);

                        return (
                            <Grid item lg={10} xs={12}>
                                <div className="comment">
                                    <div className="header">
                                        <span className="name">
                                            {value.userData?.fullName}
                                        </span>{' '}
                                        <span className="time">
                                            {timeString}
                                        </span>
                                    </div>
                                    <Divider />
                                    <div className="body">{value.comment}</div>
                                </div>
                            </Grid>
                        );
                    })}
        </Grid>
    );
}
