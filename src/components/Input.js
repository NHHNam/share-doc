import React from 'react';
import { TextInput } from 'react-native';

export default function Input({
    placeholder,
    style,
    text,
    fn,
    onPress,
    editable
}) {
    return (
        <TextInput
            style={[
                {
                    width: 300,
                    height: 40,
                    margin: 10,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: '#ccc',
                    marginTop: 20
                },
                style
            ]}
            placeholder={placeholder}
            onChangeText={fn}
            value={text}
            onPressIn={onPress}
            editable={editable}
        />
    );
}
