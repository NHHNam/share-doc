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

import { GridSearchIcon } from '@mui/x-data-grid';
import {
    getDocumentById,
    searchDocument
} from '../../../services/document.service';

export default function SearchLayout() {
    const navigate = useNavigate();
    const { state, dispatch } = useAppContext();
    const [listDocuments, setListDocuments] = useState([]);
    const [searchText, setSearchText] = useState('');

    const checkLogin = () => {
        if (!localStorage.getItem('@user')) {
            navigate('/login');
        }
    };

    const changeT = () => {
        dispatch(
            actions.setData({
                ...state.set,
                title: 'Search'
            })
        );
    };

    useEffect(() => {
        checkLogin();
        changeTitle('Search');
        changeT();
    }, []);

    const handleChangeText = (e) => {
        const { value } = e.target;
        setSearchText(value);
    };

    const search = async () => {
        try {
            const data = await searchDocument(searchText);
            if (data.length === 0) {
                getMessasge(
                    'No results found',
                    'error',
                    dispatch,
                    actions,
                    state
                );
            }
            setSearchText('');
            setListDocuments(data);
        } catch (error) {
            getMessasge(error.message, 'error', dispatch, actions, state);
        }
    };

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

    // function truncateAndHighlight(description) {
    //     const maxWords = 5;
    //     const words = description.split(' ');

    //     const truncatedWords = words.slice(0, maxWords).join(' ');
    //     const remainingWords = words.slice(maxWords);

    //     let highlightedDescription = truncatedWords;

    //     if (remainingWords.length > 0) {
    //         highlightedDescription += ' ' + remainingWords.join(' ');
    //     }

    //     highlightedDescription = highlightedDescription.replace(
    //         /<em>(.*?)<\/em>/g,
    //         '<span style="background-color: yellow;padding: 3px;">$1</span>'
    //     );

    //     return highlightedDescription;
    // }

    function truncateAndHighlight(description) {
        const maxWords = 10;
        const words = description.split(' ');

        const emTagIndex = words.findIndex((word) => word.startsWith('<em>'));
        const startIndex = Math.max(0, emTagIndex - maxWords);
        const endIndex = Math.min(words.length, emTagIndex + maxWords + 1);

        const relevantWords = words.slice(startIndex, endIndex);

        const highlightedDescription = relevantWords
            .map((word) => {
                if (word.startsWith('<em>') && word.endsWith('</em>')) {
                    const emContent = word.substring(4, word.length - 5);
                    return `<span style="background-color: yellow;">${emContent}</span>`;
                }
                return word;
            })
            .join(' ');

        return highlightedDescription;
    }

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} xs={12}>
                <Grid container lg={12} xs={12}>
                    <Grid item lg={11} xs={12}>
                        <TextField
                            id="standard-basic"
                            label="Search"
                            variant="standard"
                            onChange={handleChangeText}
                            value={searchText}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item lg={1} xs={12} marginY={1}>
                        <Button variant="contained" onClick={search}>
                            <GridSearchIcon
                                sx={{ width: '100%' }}
                            ></GridSearchIcon>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {listDocuments &&
                listDocuments.map((document) => (
                    <Grid item lg={4} xs={12}>
                        <Card>
                            <CardActionArea onClick={() => viewFile(document)}>
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
                                        dangerouslySetInnerHTML={{
                                            __html: truncateAndHighlight(
                                                document.description
                                            )
                                        }}
                                    ></Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    );
}
