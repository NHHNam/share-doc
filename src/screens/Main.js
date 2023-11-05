import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Icon from 'react-native-vector-icons/FontAwesome';
import Upload from './Upload';
import Profile from './Profile';
import Files from './Files';
import FilesDownload from './FilesDownload';
import FilesShared from './FilesShared';

const Tab = createBottomTabNavigator();

function Main() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home';
                    } else if (route.name === 'My Files') {
                        iconName = focused ? 'file' : 'file';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'user' : 'user';
                    } else if (route.name === 'Files Downloaded') {
                        iconName = focused ? 'download' : 'download';
                    } else if (route.name === 'Files Shared') {
                        iconName = focused ? 'slideshare' : 'slideshare';
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4A9DF6',
                tabBarInactiveTintColor: '#ccc',
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="My Files" component={Files} />
            <Tab.Screen name="Files Downloaded" component={FilesDownload} />
            <Tab.Screen name="Files Shared" component={FilesShared} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

export default Main;
