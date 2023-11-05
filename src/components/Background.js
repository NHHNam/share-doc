import React from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Background({ children }) {
    const imagePath = require('../assests/logo.png');
    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={imagePath} style={styles.image} />
                    <Text style={styles.text}>Share Tài Liệu</Text>
                </View>
                <View style={styles.body}>{children}</View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        flex: 3
    },
    text: {
        fontSize: 40,
        fontWeight: '700',
        fontStyle: 'italic'
    }
});
