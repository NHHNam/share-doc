import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import api from '../axios/aixos';
import { setComments, setFile } from '../store/file.slice';
import baseURL from '../config/config';
import { useNavigation } from '@react-navigation/native';
import { convert_name } from '../utils/convert_name';

export default function DocumentFind({ file }) {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const viewFile = async (idFile) => {
        try {
            const data = await api.get(`/api/product/${idFile}`);
            const dataResult = data.data;
            const blackList = await api.get(`/api/blacklist/${idFile}`);

            let acceptDownload;
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
            console.log(error.message);
        }
    };

    return (
        <View style={style.fileBlock}>
            <View>
                <TouchableOpacity
                    style={style.btnView}
                    onPress={() => viewFile(file.id)}
                >
                    <Text style={{ fontSize: 20, color: 'red' }}>
                        {convert_name(file.name)}
                    </Text>
                    <Text>{convert_name(file.description)}</Text>
                </TouchableOpacity>
            </View>
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
        padding: 10,
        borderRadius: 10
    },
    textBtn: {
        fontSize: 15,
        alignItems: 'center',
        textAlign: 'center'
    },
    fileBlock: {
        flexDirection: 'column',
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'space-between',
        maxWidth: '100%'
    },
    centeredView: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    }
});
