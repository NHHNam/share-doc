import React from 'react';
import Login from './screens/Login';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import FileView from './screens/FileView';
import Home from './screens/Home';
import Main from './screens/Main';
import Information from './screens/Information';
import Upload from './screens/Upload';
import { LogBox } from 'react-native';
import Search from './screens/Search';
import ListFile from './screens/ListFile';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ animationEnabled: false }}>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Main"
                    component={Main}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FileView"
                    component={FileView}
                    // options={{ headerShown: false }}
                    // initialParams={{ source: source, acceptDownload: true }}
                    options={{
                        title: 'Xem tài liệu'
                    }}
                />

                <Stack.Screen
                    name="Upload"
                    component={Upload}
                    // options={{ headerShown: false }}
                    options={{
                        title: 'Upload tài liệu'
                    }}
                />

                <Stack.Screen
                    name="Information"
                    component={Information}
                    options={{
                        title: 'Thông tin cá nhân',
                        headerBackTitle: ''
                    }}
                />

                <Stack.Screen
                    name="Search"
                    component={Search}
                    options={{
                        title: 'Tìm kiếm',
                        headerBackTitle: ''
                    }}
                />

                <Stack.Screen
                    name="ListFile"
                    component={ListFile}
                    options={{
                        title: '',
                        headerBackTitle: ''
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;
