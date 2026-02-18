import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Compact racing telemetry — small overlay, bottom-left.
 * Speed is the hero number; battery, power, range are tiny stats.
 */

const getBatteryColor = (pct: number) => {
    if (pct > 50) return '#30D158';
    if (pct > 20) return '#FF9500';
    return '#FF453A';
};

const TelemetryDashboard: React.FC = () => {
    const t = useAppStore((state) => state.telemetry);

    return (
        <View style={styles.container}>
            {/* Speed — hero */}
            <View style={styles.speedRow}>
                <Text style={styles.speed}>{Math.round(t.speed)}</Text>
                <Text style={styles.speedUnit}>km/h</Text>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statVal, { color: getBatteryColor(t.batteryPercent) }]}>
                        {Math.round(t.batteryPercent)}%
                    </Text>
                    <Text style={styles.statLbl}>BAT</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                    <Text style={styles.statVal}>{t.consumption.toFixed(1)}</Text>
                    <Text style={styles.statLbl}>kW</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                    <Text style={styles.statVal}>{Math.round(t.range)}</Text>
                    <Text style={styles.statLbl}>km</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    speedRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 6,
    },
    speed: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 50,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },
    speedUnit: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginLeft: 4,
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 6,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statVal: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statLbl: {
        color: '#666',
        fontSize: 9,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginTop: 1,
    },
    divider: {
        width: 1,
        height: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

export default TelemetryDashboard;
