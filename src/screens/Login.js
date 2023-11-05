import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Btn from '../components/Btn';
import Background from '../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/user.slice';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../axios/aixos';
import axios from 'axios';
import baseURL from '../config/config';

export default function Login({ navigation }) {
    const dispatch = useDispatch();

    useEffect(() => {
        AsyncStorage.getItem('@user').then((user) => {
            if (user) {
                dispatch(setUser(JSON.parse(user)));
                navigation.navigate('Main');
            } else {
                navigation.navigate('Login');
            }
        });
    }, []);

    GoogleSignin.configure({
        webClientId:
            // '983421413321-r8c3a3cmnc3l32t7r09s47s5sfta8tmt.apps.googleusercontent.com'
            '983421413321-4b9n2ae60alk2saeur165r6eorn87kb5.apps.googleusercontent.com'
    });

    const signInWithGoolge = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true
            });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
                auth.GoogleAuthProvider.credential(idToken);

            const userSignIn = await auth().signInWithCredential(
                googleCredential
            );
            const infoUser = userSignIn.user;
            console.log(infoUser);

            // if (infoUser.email.includes('tdtu.edu.vn') === false) {
            //     Alert.alert(
            //         'Thông báo',
            //         'Email không thuộc đại học Tôn Đức Thắng không thể sử dụng dịch vụ.'
            //     );
            // } else {
            const login = await axios.get(
                `${baseURL}/auth/login?email=${infoUser.email}&fullName=${infoUser.displayName}`
            );
            await AsyncStorage.setItem('@user', JSON.stringify(infoUser));
            dispatch(setUser(infoUser));
            await AsyncStorage.setItem(
                '@account',
                JSON.stringify(login.data.user)
            );
            const nameKey = `@files_${infoUser.email.trim()}`;
            let files = await AsyncStorage.getItem(nameKey);
            if (files === null) {
                await AsyncStorage.setItem(nameKey, JSON.stringify([]));
            }
            await AsyncStorage.setItem('accessToken', login.data.token);
            navigation.navigate('Main');
            // }
        } catch (error) {
            console.log(error);
            Alert.alert('Thông báo', 'Internal server');
        }
    };

    return (
        <Background>
            <View>
                <View style={styles.container}>
                    <Text style={styles.text}>
                        Lưu ý: Khi muốn sử dụng. Thì sử dụng mail do nhà trường
                        cấp.
                    </Text>
                    <Btn
                        style={{
                            borderWidth: 0,
                            backgroundColor: '#dd3444',
                            borderRadius: 30
                        }}
                        styleText={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 20,
                            height: 40,
                            alignItems: 'center'
                        }}
                        content={[
                            <Icon name="google-plus" size={30} color="white" />,
                            ' Sign in with Google'
                        ]}
                        onPress={signInWithGoolge}
                    />
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopStartRadius: 100
    },
    text: {
        color: 'black',
        fontWeight: '600',
        fontStyle: 'italic',
        fontSize: 13,
        padding: 30
    },
    btn: {
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#dd3444',
        width: 300
    }
});
