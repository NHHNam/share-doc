import React from 'react';
import { Text, StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewFile({ source }) {
    let url =
        Platform.OS === 'ios'
            ? source
            : 'https://docs.google.com/gview?embedded=true&url=' + source;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                source={{
                    uri: url
                }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                allowFileAccess
                originWhitelist={['*']}
                thirdPartyCookiesEnabled
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
