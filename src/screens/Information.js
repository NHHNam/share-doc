import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Btn from '../components/Btn';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../components/Input';

function Information({ navigation }) {
    const user = useSelector((state) => state.user.currentUser);

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                {user && <Input text={user.displayName} />}
                {user && <Input text={user.email} />}
                {user && (
                    <Image
                        source={{ uri: user.photoURL }}
                        style={{ width: 300, height: 300 }}
                    />
                )}
            </View>
        </View>
    );
}

export default Information;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden'
    },
    body: {
        flex: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});
