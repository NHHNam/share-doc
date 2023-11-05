import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/user.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Btn from '../components/Btn';
import Icon from 'react-native-vector-icons/FontAwesome';

function Profile({ navigation }) {
    const user = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const logout = async () => {
        // await AsyncStorage.clear();
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('@user');
        await AsyncStorage.removeItem('@account');
        dispatch(setUser(null));
        navigation.navigate('Login');
    };

    const goToInformation = () => {
        navigation.navigate('Information');
    };

    return (
        <SafeAreaView style={{ flex: 1, margin: 10 }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                {user && (
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>
                        {user.email}
                    </Text>
                )}
                {user && (
                    <Image
                        source={{ uri: user.photoURL }}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 40,
                            marginLeft: 10
                        }}
                    />
                )}
            </View>
            <View style={{ flex: 10, justifyContent: 'flex-end' }}>
                <Btn
                    content={[<Icon name="user" size={18} />, ' Profile']}
                    style={{
                        width: '100%',
                        backgroundColor: '#4A9DF6',
                        marginBottom: 10
                    }}
                    onPress={goToInformation}
                />
                <Btn
                    content={[<Icon name="sign-out" size={18} />, ' Logout']}
                    onPress={logout}
                    style={{ width: '100%', backgroundColor: 'red' }}
                />
            </View>
        </SafeAreaView>
    );
}

export default Profile;
