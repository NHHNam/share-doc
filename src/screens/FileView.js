import React, { useState, useEffect } from 'react';
import {
    Modal,
    SafeAreaView,
    Text,
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
    ActivityIndicator
} from 'react-native';
import WebViewFile from './WebViewFile';
import Btn from '../components/Btn';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axios/aixos';
import { setComments } from '../store/file.slice';
import moment from 'moment';
import { generateUUID } from '../utils/uuid';
import { getUserById } from '../services/user.service';
import { createComment } from '../services/comment.service';
import baseURL from '../config/config';

const Comment = ({ file }) => {
    const [user, setUser] = useState({});

    const data = async () => {
        try {
            const result = await getUserById(file.userId);
            setUser(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        data();
    }, []);

    return (
        <View style={styles.viewComment}>
            <Text key={file.id}>
                <Text
                    style={{
                        color: '#2258ff',
                        fontWeight: '800',
                        fontSize: 18
                    }}
                >
                    {user && user.fullName}
                </Text>{' '}
                | {moment(file.createdAt).fromNow()}
            </Text>
            <Text key={file.id}>{file.comment}</Text>
        </View>
    );
};

const FileView = ({ navigation }) => {
    const dispatch = useDispatch();
    const [curUser, setCurUser] = useState({});
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const file = useSelector((state) => state.file.currentFile);
    const comment = useSelector((state) => state.file.comments);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkFileIsExist = (files, path) => {
        return files.some((item) => item.filename === path);
    };

    const saveToCache = async (path, filename) => {
        try {
            const filesRaw = await AsyncStorage.getItem(
                '@files_' + curUser.email.trim()
            );
            const files = JSON.parse(filesRaw);
            const exist = checkFileIsExist(files, filename);
            const id = generateUUID();
            if (!exist) {
                files.push({
                    id,
                    filename,
                    path
                });
                await AsyncStorage.setItem(
                    '@files_' + curUser.email.trim(),
                    JSON.stringify(files)
                );
            }
        } catch (error) {
            Alert.alert('Anouncement', error.message);
        }
    };

    const downloadFile = async (filename, uri) => {
        // setLoading(true);
        filename = filename.replace(`${filename.split('_')[0]}_`, '');
        const { dirs } = RNFetchBlob.fs;
        const dirToSave =
            Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
        const configfb = {
            fileCache: true,
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            path: `${dirToSave}/${filename}`
        };
        const configOptions = Platform.select({
            ios: {
                fileCache: configfb.fileCache,
                path: configfb.path
            },
            android: configfb
        });

        RNFetchBlob.config(configOptions)
            .fetch('GET', uri, {})
            .then(async (res) => {
                // setLoading(false);
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(res);
                    }, 1000);
                });
            })
            .then(async (res) => {
                if (Platform.OS === 'ios') {
                    await RNFetchBlob.fs.writeFile(
                        configfb.path,
                        res.data,
                        'base64'
                    );

                    await saveToCache(configfb.path, file.name);

                    // RNFetchBlob.ios.previewDocument(configfb.path);
                }

                if (Platform.OS === 'android') {
                    await saveToCache(res.path(), file.name);
                    Alert.alert('Thông báo', 'Tải file thành công');
                }
                // console.log('The file saved to ', res);
            })
            .catch((e) => {
                Alert.alert('Thông báo', e.message);
            });
    };

    const goBack = async () => {
        navigation.goBack();
    };

    const getCurUser = async () => {
        try {
            const result = await AsyncStorage.getItem('@account');
            setCurUser(JSON.parse(result));
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const addComment = async () => {
        try {
            if (text.trim() === '') {
                throw new Error('Comment is empty');
            }
            // await api.post(`/api/comment`, {
            //     comment: text,
            //     userId: curUser.id,
            //     productId: file.id
            // });

            await createComment({
                comment: text,
                userId: curUser.id,
                productId: file.id
            });
            refreshComment(file.id);
            setText('');
        } catch (error) {
            Alert.alert('Thông báo', error.message);
        }
    };

    const refreshComment = async (id) => {
        try {
            const file = await api.get('/api/product/' + id);
            setComments(
                file.data?.comments
                    ?.slice()
                    .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCurUser();
        setComments(
            comment
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
    }, []);

    return (
        <View style={styles.container}>
            <Modal
                supportedOrientations={[
                    'portrait',
                    'landscape',
                    'portrait-upside-down',
                    'landscape-left',
                    'landscape-right'
                ]}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <SafeAreaView style={styles.centeredView}>
                    <View style={{ height: 30 }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                        >
                            <Text
                                style={{
                                    padding: 5,
                                    fontSize: 18,
                                    textAlign: 'right',
                                    marginEnd: 10
                                }}
                            >
                                <Icon name="close" size={30} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {file && <WebViewFile source={file.source} />}
                </SafeAreaView>
            </Modal>
            <Modal
                supportedOrientations={['portrait']}
                animationType="slide"
                transparent={true}
                visible={loading}
                onRequestClose={() => {
                    setLoading(!loading);
                }}
            >
                <SafeAreaView style={[styles.centeredView, { opacity: 0.5 }]}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </SafeAreaView>
            </Modal>

            <View style={styles.viewPage}>
                <View style={{}}>
                    {file && (
                        <Text
                            style={{
                                fontSize: 20,
                                margin: 30,
                                fontWeight: '500',
                                color: 'red',
                                textAlign: 'center'
                            }}
                        >
                            {file.name}
                        </Text>
                    )}
                </View>
                <View style={{ flex: 2 }}>
                    {file && (
                        <Text style={{ textAlign: 'left', fontSize: 16 }}>
                            {file.description}
                        </Text>
                    )}
                </View>
                <View style={{ width: '100%' }}>
                    <Btn
                        content={[
                            <Icon name="file-o" size={20} color="#fff" />,
                            ' ',
                            <Text style={{ fontWeight: '700' }}>
                                View Online
                            </Text>
                        ]}
                        style={{ marginTop: 10, width: '100%' }}
                        onPress={() => setModalVisible(true)}
                    />
                    {file && (
                        <Btn
                            disable={file.acceptDownload ? false : true}
                            style={[
                                { marginTop: 10, width: '100%' },
                                file.acceptDownload
                                    ? ''
                                    : { backgroundColor: '#ccc' }
                            ]}
                            content={[
                                <Icon name="download" size={20} color="#fff" />,
                                ' ',
                                <Text style={{ fontWeight: '700' }}>
                                    Download
                                </Text>
                            ]}
                            onPress={() => {
                                const nameFile =
                                    file.pathDownload.match(/\/([^/]+)$/)[1];
                                // setLoading(true);
                                // downloadFile(nameFile, file.source);
                                // downloadFile(nameFile, file.pathDownload);
                                downloadFile(
                                    nameFile,
                                    `${baseURL}/api/product/download/${file.id}`
                                );
                            }}
                        />
                    )}
                </View>
            </View>
            <View style={styles.commentView}>
                <Text style={styles.title}>
                    <Icon style={{ fontSize: 30, color: 'red' }} name="fire" />
                    Comments
                </Text>
                <View
                    style={{
                        width: '100%',
                        // flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Input
                        placeholder={'Nhập comment'}
                        text={text}
                        style={{ width: '100%' }}
                        fn={(text) => setText(text)}
                    />
                    <Btn
                        content={[<Icon name="plane" />, ' Send']}
                        onPress={addComment}
                        style={{
                            width: '100%',
                            // height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 5
                        }}
                        styleText={{ fontSize: 13 }}
                    />
                </View>
                <ScrollView style={{ width: '100%' }}>
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => <Comment file={item} />}
                        keyExtractor={(item) => item.id}
                    />
                </ScrollView>
            </View>
            <View style={{ flex: 0.3 }}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 5
    },
    centeredView: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    viewPage: {
        flex: 6,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        flexWrap: 'wrap-reverse',
        marginLeft: 10
    },
    btns: {
        flexDirection: 'row'
    },
    header: {
        backgroundColor: '#fff',
        // elevation: 2, // Add elevation for shadow on Android devices
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        width: '100%',
        padding: 10,
        height: 100,
        flex: 1
    },
    headerAndroid: {
        backgroundColor: '#fff',
        // elevation: 2, // Add elevation for shadow on Android devices
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        width: '100%',
        padding: 10,
        // height: 50,
        flex: 0.4
    },
    commentView: {
        flex: 5,
        width: '100%'
    },
    viewComment: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        // justifyContent: 'space-around',
        // flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 10
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
        fontStyle: 'italic'
    }
});

export default FileView;
