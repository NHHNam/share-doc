import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DocumentFind from '../components/DocumentFind';
import { FlatList } from 'react-native-gesture-handler';

export default function ListFile() {
    const files = useSelector((state) => state.file.listFile);
    return (
        <View>
            <FlatList
                data={files}
                renderItem={({ item }) => <DocumentFind file={item} />}
            />
        </View>
    );
}
