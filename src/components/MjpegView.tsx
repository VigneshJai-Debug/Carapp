import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MjpegViewProps {
    url: string;
}

export const MjpegView: React.FC<MjpegViewProps> = ({ url }) => {
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: `${url}/stream` }}
                style={styles.webview}
                javaScriptEnabled={false}
                scrollEnabled={false}
                overScrollMode="never"
                mixedContentMode="always"
                allowsInlineMediaPlayback={true}
                originWhitelist={['*']}
                startInLoadingState={false}
                scalesPageToFit={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    webview: {
        flex: 1,
        backgroundColor: 'black',
    },
});
