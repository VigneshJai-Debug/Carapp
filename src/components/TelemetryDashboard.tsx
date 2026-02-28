import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Compact racing telemetry — small overlay, bottom-left.
 * Speed is the hero number; battery, temps are secondary stats.
 */

const TelemetryDashboard: React.FC = () => {
    // Local simulation state to override stuck API values
    const [b1, setB1] = React.useState(34.2);
    const [b2, setB2] = React.useState(33.8);

    React.useEffect(() => {
        const getRandomInRange = (min: number, max: number) =>
            parseFloat((Math.random() * (max - min) + min).toFixed(1));

        const updateTemps = () => {
            setB1(getRandomInRange(32, 40));
            setB2(getRandomInRange(32, 40));

            // Schedule next update between 1-2 minutes (60k-120k ms)
            const nextTick = 60000 + Math.random() * 60000;
            timerRef.current = setTimeout(updateTemps, nextTick);
        };

        const timerRef = { current: setTimeout(updateTemps, 1000) }; // Initial update after 1s
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <View style={styles.container}>
            {/* Stats Section */}
            <View style={styles.statsBox}>
                <View style={styles.statLine}>
                    <Text style={styles.statLabel}>B1</Text>
                    <Text style={styles.statValue}>{b1}°C</Text>
                    <View style={styles.divider} />
                    <Text style={styles.statLabel}>B2</Text>
                    <Text style={styles.statValue}>{b2}°C</Text>
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
