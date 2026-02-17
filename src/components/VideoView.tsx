import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RTCView, MediaStream } from 'react-native-webrtc';

interface VideoViewProps {
    stream: MediaStream | null;
}

export const VideoView: React.FC<VideoViewProps> = ({ stream }) => {
    if (!stream) {
        return <View style={styles.container} />; // Placeholder black screen
    }

    return (
        <View style={styles.container}>
            <RTCView
                streamURL={stream.toURL()}
                style={styles.video}
                objectFit="cover"
                mirror={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
