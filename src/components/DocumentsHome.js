import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { setListFile } from '../store/file.slice';

export default function DocumentsHome({ data }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const saveListFile = () => {
        dispatch(setListFile(data.products));
    };

    return (
        <View style={style.container}>
            <TouchableOpacity
                style={style.btn}
                disabled={false}
                activeOpacity={0.5}
                onPress={() => {
                    saveListFile();
                    navigation.navigate('ListFile');
                }}
            >
                <View>
                    <Text style={style.text}>{data && data.name}</Text>
                    <Text style={style.text}>
                        {data && data.products.length}
                    </Text>
                </View>
                <Icon name="arrow-right" size={25} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        padding: 10
    },
    btn: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        // color: '#fff',
        fontWeight: '700',
        fontSize: 18
    }
});
