import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Compact horizontal pill controls for the racing HUD.
 */
const ControlPanel: React.FC = () => {
    const activeModel = useAppStore((state) => state.activeModel);
    const inferenceEnabled = useAppStore((state) => state.inferenceEnabled);
    const setActiveModel = useAppStore((state) => state.setActiveModel);
    const toggleInference = useAppStore((state) => state.toggleInference);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.pill, activeModel === 'cone' ? styles.active : styles.inactive]}
                onPress={() => setActiveModel('cone')}
            >
                <Text style={styles.pillText}>CONE</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.pill, activeModel === 'pothole' ? styles.active : styles.inactive]}
                onPress={() => setActiveModel('pothole')}
            >
                <Text style={styles.pillText}>POTHOLE</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.pill, inferenceEnabled ? styles.aiOn : styles.aiOff]}
                onPress={toggleInference}
            >
                <Text style={styles.pillText}>AI {inferenceEnabled ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 6,
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
    },
    active: {
        backgroundColor: 'rgba(0,122,255,0.85)',
    },
    inactive: {
        backgroundColor: 'rgba(60,60,60,0.7)',
    },
    aiOn: {
        backgroundColor: 'rgba(48,209,88,0.85)',
    },
    aiOff: {
        backgroundColor: 'rgba(255,59,48,0.8)',
    },
    pillText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 11,
        letterSpacing: 0.5,
    },
});

export default ControlPanel;
