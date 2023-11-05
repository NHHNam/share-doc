import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    Platform,
    Linking,
    PermissionsAndroid,
    TouchableOpacity
} from 'react-native';
import Btn from '../components/Btn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDocumentsSharedByUserid } from '../services/document.service';
import api from '../axios/aixos';
import { useDispatch } from 'react-redux';
import { setComments, setFile } from '../store/file.slice';
import baseURL from '../config/config';
import { convert_name } from '../utils/convert_name';

export default function FilesShared({ navigation }) {
    const [filesDownload, setFilesDownload] = useState([]);
    const [currUser, setCurrUser] = useState({});
    const dispatch = useDispatch();

    const getData = async () => {
        const userRaw = await AsyncStorage.getItem('@account');
        const user = JSON.parse(userRaw);
        setCurrUser(user);
        const files = await getDocumentsSharedByUserid(user.id);
        setFilesDownload(files);
    };

    const getListShared = async () => {
        const files = await getDocumentsSharedByUserid(currUser.id);
        setFilesDownload(files);
    };
    // console.log(currUser);
    // console.log(filesDownload);

    useEffect(() => {
        setTimeout(async () => {
            await getData();
            await getListShared();
        }, 100);
    }, []);

    const viewFile = async (idFile) => {
        try {
            const data = await api.get(`/api/product/${idFile}`);
            const dataResult = data.data;
            const blackList = await api.get(`/api/blacklist/${idFile}`);

            if (blackList.data?.metadata) {
                acceptDownload = false;
            } else {
                acceptDownload = true;
            }

            dispatch(
                setFile({
                    name: dataResult.name,
                    description: dataResult.description,
                    source: `${baseURL}/files/${encodeURI(dataResult.path)}`,
                    pathDownload: `${baseURL}/files/${encodeURI(
                        dataResult.pathDownload
                    )}`,
                    acceptDownload: acceptDownload,
                    comments: dataResult?.comments || [],
                    id: dataResult?.id
                })
            );
            dispatch(setComments(dataResult?.comments || []));
            navigation.navigate('FileView');
        } catch (error) {
            Alert.alert('Thông báo', error.message);
        }
    };

    const Item = ({ item }) => {
        return (
            <View style={style.item}>
                <TouchableOpacity onPress={() => viewFile(item.id)}>
                    <Text
                        style={{
                            flexShrink: 1,
                            fontSize: 18,
                            fontWeight: '700',
                            color: 'red'
                        }}
                        ellipsizeMode="tail"
                    >
                        {convert_name(item.name)}
                    </Text>
                    <Text
                        style={{
                            flexShrink: 1,
                            fontSize: 13,
                            fontWeight: '700'
                        }}
                        ellipsizeMode="tail"
                    >
                        {convert_name(item.description)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        // Perform your refresh action here
        // For example, fetch new data from a server
        // After the refresh action is completed, setRefreshing(false)
        getListShared();
        setRefreshing(true);

        // Simulate a delay for demonstration purposes
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaView>
            <Text style={style.text}>Files Shared</Text>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{ height: '100%' }}
            >
                <FlatList
                    data={filesDownload}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item) => item.id}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    btn_add: {
        width: 50
    },
    item: {
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        maxWidth: '100%'
    },
    text: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18
    }
});
