import {
    Button,
    Divider,
    Grid,
    TextareaAutosize,
    Typography
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import './ViewFile.css';
import {
    apiURL,
    commentPostedTime,
    getMessasge,
    useAppContext
} from '../../utils';
import { getDocumentById } from '../../services/document.service';
import { actions } from '../../store';
import { addComment } from '../../services/comment.service';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

import { getBlacklistByDocumentId } from '../../services/blacklist.service';
import { Download, Share } from '@mui/icons-material';
import { baseURL } from '../../config/config';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getUserById } from '../../services/user.service';

export default function ViewFile() {
    const [documentChoose, setDocumentChoose] = useState(null);
    const [comment, setComment] = useState(null);
    const [comments, setComments] = useState(null);
    const [blacklist, setBlacklist] = useState(null);
    const [textToCopy, setTextToCopy] = useState('Text to be copied');
    const [copied, setCopied] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    const { state, dispatch } = useAppContext();

    const setData = async () => {
        try {
            setDocumentChoose(state.set.documentChoose);
            // setComments(state.set.documentChoose.comments);

            return state.set.documentChoose?.id;
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000); // Reset copied status after 2 seconds
    };

    // console.log(blacklist);

    const setDataComment = async (id) => {
        try {
            const data = (await getDocumentById(id)).comments;
            // setComments(data.comments);
            if (data) {
                const datamap = await Promise.all(
                    data.map(async (doc) => {
                        const data = await getUserById(doc.userId);
                        console.log(data);
                        return {
                            ...doc,
                            userData: data
                        };
                    })
                );
                setComments(datamap);
            }
        } catch (error) {
            getMessasge(error.message, 'erorr', dispatch, actions, state);
        }
    };

    const pushComment = async (id) => {
        try {
            await addComment({ id, name: comment });
            getMessasge('Added comment', 'success', dispatch, actions, state);
            await setDataComment(id);
            setComment(null);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    useEffect(() => {
        setTimeout(async () => {
            const id = await setData();
            const isInBlackList = await getBlacklistByDocumentId(id);
            if (isInBlackList) {
                setBlacklist(true);
            } else {
                setBlacklist(false);
            }
            await setDataComment(id);
            setTextToCopy(`${baseURL}/api/product/download/${id}`);
        }, 100);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768); // Adjust breakpoint as needed
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const maxLength = isDesktop ? 160 : 40;

    const download = async () => {
        try {
            const response = await apiURL.get(
                `/api/product/download/${documentChoose.id}`,
                {
                    responseType: 'blob' // Tell Axios to expect a blob response
                }
            );

            if (response.status === 200) {
                const blob = response.data;
                const filename = documentChoose.pathDownload;

                // Create a URL for the blob and trigger a download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);

                // Set content type to "application/octet-stream"
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error('Error downloading the file');
            }
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

    const [showFullDescription, setShowFullDescription] = useState(true);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div>
            {documentChoose && (
                <div>
                    <Typography
                        component="h1"
                        variant="h4"
                        color="red"
                        // noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        {documentChoose.name}
                    </Typography>
                    <Typography
                        component="h1"
                        variant="h6"
                        // color="#ccc"
                        noWrap={showFullDescription}
                        sx={showFullDescription ? { flexGrow: 1 } : undefined}
                    >
                        {documentChoose.description}
                    </Typography>
                    {documentChoose.description.length > maxLength && (
                        <Button
                            onClick={toggleDescription}
                            variant="outlined"
                            color="secondary"
                            sx={{ mb: 2 }}
                        >
                            {showFullDescription ? 'Show' : 'Hide'}{' '}
                            {showFullDescription ? 'More' : 'Less'}
                        </Button>
                    )}
                    <div className="document">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={`${baseURL}/files/${documentChoose?.path}`}
                            />
                        </Worker>
                    </div>

                    <Grid container spacing={2} mt={3}>
                        <Grid item lg={3} xs={12}>
                            <Button
                                variant="outlined"
                                sx={{ ml: 1 }}
                                disabled={blacklist}
                                onClick={download}
                            >
                                <Download />
                            </Button>

                            {/* <CopyToClipboard
                                text={textToCopy}
                                onCopy={handleCopy}
                            >
                                <Button
                                    variant="outlined"
                                    disabled={blacklist}
                                    sx={{ ml: 1 }}
                                >
                                    <Share />
                                </Button>
                            </CopyToClipboard>
                            {copied && (
                                <span style={{ color: 'green' }}>Copied!</span>
                            )} */}
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={3}>
                        <Grid item lg={12} xs={12}>
                            <Grid
                                container
                                lg={12}
                                xs={12}
                                style={{ alignItems: 'center' }}
                            >
                                <Grid item lg={12} xs={12}>
                                    <TextareaAutosize
                                        minRows={2}
                                        style={{
                                            width: '100%',
                                            resize: 'none',
                                            borderRadius: 10,
                                            padding: 10
                                        }}
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    xs={12}
                                    marginY={1}
                                    style={{
                                        textAlign: 'center',
                                        marginLeft: 10
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            pushComment(documentChoose.id)
                                        }
                                        style={{
                                            width: '100%',
                                            alignItems: 'center'
                                        }}
                                    >
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} margin={1}>
                        {comments &&
                            comments
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                )
                                .map((value) => {
                                    const timestamp = Date.parse(
                                        value.createdAt
                                    );
                                    const timeInMilliseconds =
                                        Date.now() - timestamp; // Calculate the time difference in milliseconds
                                    const timeString =
                                        commentPostedTime(timeInMilliseconds);

                                    return (
                                        <Grid item lg={10} xs={12}>
                                            <div className="comment">
                                                <div className="header">
                                                    <span className="name">
                                                        {
                                                            value.userData
                                                                ?.fullName
                                                        }
                                                    </span>{' '}
                                                    <span className="time">
                                                        {timeString}
                                                    </span>
                                                </div>
                                                <Divider />
                                                <div className="body">
                                                    {value.comment}
                                                </div>
                                            </div>
                                        </Grid>
                                    );
                                })}
                    </Grid>
                </div>
            )}
        </div>
    );
}
