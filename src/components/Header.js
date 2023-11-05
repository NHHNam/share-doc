import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
export default function HeaderComp({ backPage }) {
    const navigation = useNavigation();
    const goBack = () => {
        navigation.navigate(backPage);
    };
    return (
        <TouchableOpacity style={style.btn} onPress={goBack}>
            <Icon
                name="arrow-left"
                style={{ marginLeft: 10 }}
                size={20}
                color={'#fff'}
            />
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({});
