import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Btn({
    content,
    onPress,
    style,
    styleText,
    disable = false,
    opacity = 0.8
}) {
    return (
        <TouchableOpacity
            style={[styles.btn, style]}
            onPress={onPress}
            activeOpacity={opacity}
            disabled={disable}
        >
            <Text
                style={[
                    {
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 20
                    },
                    styleText
                ]}
            >
                {content}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#4A9DF6',
        width: 300
    }
});
