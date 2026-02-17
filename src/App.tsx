import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar, SafeAreaView } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { VideoView } from './components/VideoView';
import { DetectionOverlay } from './components/DetectionOverlay';
import TelemetryDashboard from './components/TelemetryDashboard'; // Correction: default export
import ControlPanel from './components/ControlPanel'; // Correction: default export
import MapDashboard from './components/MapDashboard'; // Correction: default export
import { WebRTCClient } from './webrtc/peer';
import { useAppStore } from './store/useAppStore';

// Initialize WebRTC Client Singleton
// In a real app, might want to do this in a useEffect or Context, but singleton is fine for this scope.
// Assuming signaling server is at a fixed IP.
const SIGNALING_URL = 'ws://192.168.4.1:8080'; // Example Pi IP in AP mode
const rtcClient = new WebRTCClient(SIGNALING_URL);

export default function App() {
    useKeepAwake(); // Prevent screen sleep
    const [remoteStream, setRemoteStream] = useState<any>(null);
    const connectionStatus = useAppStore(state => state.connectionStatus);

    useEffect(() => {
        rtcClient.onRemoteStream = (stream) => {
            setRemoteStream(stream);
        };
        rtcClient.connect();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />

            {/* 1. Video Layer (Background) */}
            <View style={styles.videoLayer}>
                <VideoView stream={remoteStream} />
            </View>

            {/* 2. Detection Layer (Over Video) */}
            <View style={styles.overlayLayer}>
                <DetectionOverlay />
            </View>

            {/* 3. UI Dashboard Layer (Top) */}
            <View style={styles.uiLayer}>

                {/* Top Bar: Connection Status */}
                <View style={styles.topBar}>
                    <View style={[styles.statusDot, { backgroundColor: connectionStatus === 'connected' ? '#0F0' : '#F00' }]} />
                    <Text style={styles.statusText}>{connectionStatus.toUpperCase()}</Text>
                </View>

                {/* Left Panel: Telemetry */}
                <View style={styles.leftPanel}>
                    <TelemetryDashboard />
                </View>

                {/* Right Panel: Controls + Map */}
                <View style={styles.rightPanel}>
                    <View style={styles.mapContainer}>
                        <MapDashboard />
                    </View>
                    <View style={styles.controlsContainer}>
                        <ControlPanel />
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    overlayLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    uiLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 3,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topBar: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'black',
        textShadowRadius: 3,
    },
    leftPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    rightPanel: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    mapContainer: {
        width: 200,
        height: 150,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
    },
    controlsContainer: {
        //
    }
});
