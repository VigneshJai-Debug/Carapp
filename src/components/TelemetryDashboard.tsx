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
            {/* Speed Section */}
            <View style={styles.speedBox}>
                <Text style={styles.speedValue}>{Math.round(telemetry.speed)}</Text>
                <Text style={styles.speedUnit}>KM/H</Text>
            </View>

            {/* Stats Section */}
            <View style={styles.statsBox}>
                <View style={styles.statLine}>
                    <Text style={styles.statLabel}>BATT</Text>
                    <Text style={[styles.statValue, { color: telemetry.batteryPercent < 20 ? '#FF453A' : '#30D158' }]}>
                        {Math.round(telemetry.batteryPercent)}%
                    </Text>
                </View>

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
        minWidth: 160,
    },
    speedBox: {
        alignItems: 'center',
        marginRight: 12,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.1)',
        paddingRight: 10,
    },
    speedValue: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
        fontFamily: 'System', // Bold racing font
    },
    speedUnit: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10,
        fontWeight: '700',
        marginTop: -4,
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
