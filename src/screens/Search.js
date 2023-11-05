import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../axios/aixos';
import Input from '../components/Input';
import Btn from '../components/Btn';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentFind from '../components/DocumentFind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentSearch from '../components/DocumentSearch';

export default function Search() {
    const [loading, setLoading] = useState(false);
    const [textSearch, setTextSeach] = useState('');
    const [files, setListFile] = useState([]);
    const [currentUser, setCurrentUser] = useState({});

    const searchFile = async () => {
        try {
            if (textSearch == '') {
                throw new Error('Please enter your word search');
            }

            const data = await api.post(`/api/product/search`, {
                search: textSearch || '',
                idUser: currentUser.id
            });
            const dataResult = data.data;

            if (dataResult.length == 0) {
                setTextSeach('');
                throw new Error('No Document found');
            }

            setLoading(false);
            setTimeout(() => {
                setListFile(dataResult);
                setTextSeach('');
            }, 500);
        } catch (error) {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Thông báo', error.message);
            }, 500);
        }
    };

    useEffect(() => {
        setTimeout(async () => {
            const user = await AsyncStorage.getItem('@account');
            setCurrentUser(JSON.parse(user));
        }, 100);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Modal
                supportedOrientations={['portrait']}
                animationType="slide"
                transparent={true}
                visible={loading}
                onRequestClose={() => {
                    setLoading(!loading);
                }}
            >
                <SafeAreaView style={[style.centeredView, { opacity: 0.5 }]}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </SafeAreaView>
            </Modal>
            <View style={{ flexDirection: 'row' }}>
                <Input
                    placeholder={'Enter your word to search'}
                    text={textSearch}
                    fn={(text) => setTextSeach(text)}
                    style={{
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderRadius: 0,
                        borderColor: '#ccc'
                    }}
                />
                <Btn
                    content={<Icon name="search" />}
                    style={{
                        width: 65,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20
                    }}
                    styleText={{ fontSize: 13 }}
                    onPress={() => {
                        setLoading(true);
                        searchFile();
                    }}
                />
            </View>
            <FlatList
                data={files}
                renderItem={({ item }) => <DocumentSearch file={item} />}
            />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    header: {
        flex: 1.5,
        // borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        padding: 10
    },
    body: {
        flex: 15
    },
    textBack: {
        fontSize: 20
    },
    btnView: {
        backgroundColor: '#4A9DF6',
        padding: 10,
        borderRadius: 10
    },
    textBtn: {
        fontSize: 15
    },
    fileBlock: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        justifyContent: 'space-around',
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 10
    },
    centeredView: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    }
});
