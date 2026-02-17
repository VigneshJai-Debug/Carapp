import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

const ControlPanel: React.FC = () => {
    const activeModel = useAppStore((state) => state.activeModel);
    const inferenceEnabled = useAppStore((state) => state.inferenceEnabled);
    const setActiveModel = useAppStore((state) => state.setActiveModel);
    const toggleInference = useAppStore((state) => state.toggleInference);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>CONTROLS</Text>

            <TouchableOpacity
                style={[styles.button, activeModel === 'cone' ? styles.activeBtn : styles.inactiveBtn]}
                onPress={() => setActiveModel('cone')}
            >
                <Text style={styles.btnText}>MODEL: CONE</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, activeModel === 'pothole' ? styles.activeBtn : styles.inactiveBtn]}
                onPress={() => setActiveModel('pothole')}
            >
                <Text style={styles.btnText}>MODEL: POTHOLE</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={[styles.button, inferenceEnabled ? styles.activeBtn : styles.dangerBtn]}
                onPress={toggleInference}
            >
                <Text style={styles.btnText}>
                    INFERENCE: {inferenceEnabled ? 'ON' : 'OFF'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
        width: 160,
    },
    header: {
        color: '#AAA',
        fontSize: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    activeBtn: {
        backgroundColor: '#007AFF',
    },
    inactiveBtn: {
        backgroundColor: '#333',
    },
    dangerBtn: {
        backgroundColor: '#FF3B30',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    separator: {
        height: 10,
    }
});

export default ControlPanel;
