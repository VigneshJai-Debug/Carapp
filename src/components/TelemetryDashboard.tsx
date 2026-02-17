import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useAppStore } from '../store/useAppStore';

const TelemetryDashboard: React.FC = () => {
    const telemetry = useAppStore((state) => state.telemetry);

    return (
        <View style={styles.container}>
            {/* Speed Gauge */}
            <View style={styles.gaugeContainer}>
                <Text style={styles.value}>{Math.round(telemetry.speed)}</Text>
                <Text style={styles.unit}>km/h</Text>
            </View>

            {/* Battery Gauge */}
            <View style={styles.gaugeContainer}>
                <Text style={[styles.value, { color: getBatteryColor(telemetry.batteryPercent) }]}>
                    {Math.round(telemetry.batteryPercent)}%
                </Text>
                <Text style={styles.unit}>BATTERY</Text>
            </View>

            {/* Power Consumption */}
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>POWER:</Text>
                <Text style={styles.statValue}>{telemetry.consumption.toFixed(1)} kW</Text>
            </View>

            {/* Range (Est) */}
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>RANGE:</Text>
                <Text style={styles.statValue}>{Math.round(telemetry.range)} km</Text>
            </View>
        </View>
    );
};

const getBatteryColor = (percent: number) => {
    if (percent > 50) return '#00FF00'; // Green
    if (percent > 20) return '#FFA500'; // Orange
    return '#FF0000'; // Red
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        width: 150,
    },
    gaugeContainer: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        paddingBottom: 10,
    },
    value: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    unit: {
        fontSize: 14,
        color: '#CCC',
        marginTop: -5,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    statLabel: {
        color: '#AAA',
        fontSize: 12,
    },
    statValue: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default TelemetryDashboard;
