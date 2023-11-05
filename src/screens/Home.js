import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    RefreshControl,
    Modal,
    ActivityIndicator
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Input from '../components/Input';

import api from '../axios/aixos';
import DocumentsHome from '../components/DocumentsHome';

function Home({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const getData = async () => {
        try {
            const res = await api.get('/api/category/nonPrivate');
            const data = res.data;

            setCategories(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        getData();
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    };

    return (
        <SafeAreaView style={style.container}>
            <View style={style.body}>
                <Modal
                    supportedOrientations={['portrait']}
                    animationType="slide"
                    transparent={true}
                    visible={loading}
                    onRequestClose={() => {
                        setLoading(!loading);
                    }}
                >
                    <SafeAreaView
                        style={[style.centeredView, { opacity: 0.5 }]}
                    >
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
                <Input
                    style={{
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderRadius: 0,
                        borderColor: '#ccc',
                        width: '100%'
                    }}
                    placeholder={'Enter your word to search'}
                    onPress={() => navigation.navigate('Search')}
                    editable={false}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#ff0000']} // Customize the loading indicator color(s)
                        />
                    }
                >
                    <FlatList
                        data={categories}
                        renderItem={({ item }) => <DocumentsHome data={item} />}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
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

export default Home;
