import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    Platform,
    Linking,
    PermissionsAndroid
} from 'react-native';
import Btn from '../components/Btn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { convert_name } from '../utils/convert_name';

export default function FilesDownload() {
    const [filesDownload, setFilesDownload] = useState([]);
    const [currUser, setCurrUser] = useState({});

    const getData = async () => {
        const userRaw = await AsyncStorage.getItem('@account');
        const user = JSON.parse(userRaw);
        setCurrUser(user);
        const files = await AsyncStorage.getItem('@files_' + user.email);
        setFilesDownload(JSON.parse(files));
    };

    const getListDownload = async () => {
        const files = await AsyncStorage.getItem('@files_' + currUser.email);
        setFilesDownload(JSON.parse(files));
    };
    // console.log(currUser);
    // console.log(filesDownload);

    useEffect(() => {
        getData();
        getListDownload();
    }, []);

    const viewFile = async (path) => {
        try {
            if (Platform.OS == 'ios') {
                RNFetchBlob.ios.openDocument(path);
            } else if (Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                console.log(path);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await RNFetchBlob.android.actionViewIntent(
                        `${path}`,
                        'application/pdf'
                    );
                } else {
                    Alert.alert(
                        'Permission Denied!',
                        'You need to give storage permission to download the file'
                    );
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const shareFile = (path) => {
        RNFetchBlob.ios.previewDocument(path);
    };

    const handleDeleteFile = async (id) => {
        const filesRaw = await AsyncStorage.getItem('@files_' + currUser.email);
        const files = JSON.parse(filesRaw);
        const removeObjectArray = files.filter((item) => item.id !== id);
        await AsyncStorage.setItem(
            '@files_' + currUser.email,
            JSON.stringify(removeObjectArray)
        );
        setFilesDownload(removeObjectArray);
    };

    const Item = ({ item }) => {
        return (
            <View style={style.item}>
                <View>
                    <Text
                        style={{
                            flexShrink: 1,
                            fontSize: 18,
                            fontWeight: '700',
                            color: 'red'
                        }}
                        ellipsizeMode="tail"
                    >
                        {convert_name(item.filename)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Btn
                        content={<Icon name="eye" />}
                        style={[style.btn_add, { height: 30, marginEnd: 10 }]}
                        onPress={() => viewFile(item.path)}
                    />

                    <Btn
                        content={<Icon name="share" />}
                        style={[style.btn_add, { height: 30, marginEnd: 10 }]}
                        onPress={() => shareFile(item.path)}
                    />

                    <Btn
                        content={<Icon name="trash-o" />}
                        style={[style.btn_add, { height: 30 }]}
                        onPress={() => handleDeleteFile(item.id)}
                    />
                </View>
            </View>
        );
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        // Perform your refresh action here
        // For example, fetch new data from a server
        // After the refresh action is completed, setRefreshing(false)
        getListDownload();
        setRefreshing(true);

        // Simulate a delay for demonstration purposes
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaView>
            <Text style={style.text}>Files Download</Text>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{
                    height: '100%'
                }}
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
