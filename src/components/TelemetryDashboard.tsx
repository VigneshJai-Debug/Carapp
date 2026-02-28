import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Compact racing telemetry — small overlay, bottom-left.
 * Speed is the hero number; battery, temps are secondary stats.
 */

const TelemetryDashboard: React.FC = () => {
    const telemetry = useAppStore((state) => state.telemetry);

    return (
        <View style={styles.container}>
            {/* Stats Section */}
            <View style={styles.statsBox}>
                <View style={styles.statLine}>
                    <Text style={styles.statLabel}>B1</Text>
                    <Text style={styles.statValue}>{telemetry.battery1Temp}°C</Text>
                    <View style={styles.divider} />
                    <Text style={styles.statLabel}>B2</Text>
                    <Text style={styles.statValue}>{telemetry.battery2Temp}°C</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        minWidth: 120,
    },
    statsBox: {
        flex: 1,
        justifyContent: 'center',
    },
    statLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 9,
        fontWeight: '800',
        width: 30,
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 8,
    },
});

export default TelemetryDashboard;
