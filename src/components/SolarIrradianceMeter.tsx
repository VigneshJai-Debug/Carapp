import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Compact single-line solar badge for the racing HUD top strip.
 * Shows: ☀ <GHI> W/m²  with severity color.
 */

function getSeverityColor(ghi: number): string {
    if (ghi >= 800) return '#FF453A';
    if (ghi >= 500) return '#FF9500';
    if (ghi >= 200) return '#FFD60A';
    return '#30D158';
}

const SolarIrradianceMeter: React.FC = () => {
    const ghi = useAppStore((state) => state.solarIrradiance.ghi);

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>☀</Text>
            <Text style={[styles.value, { color: getSeverityColor(ghi) }]}>
                {Math.round(ghi)}
            </Text>
            <Text style={styles.unit}>W/m²</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    icon: {
        fontSize: 13,
        marginRight: 4,
    },
    value: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowRadius: 3,
    },
    unit: {
        fontSize: 10,
        color: '#888',
        fontWeight: '600',
        marginLeft: 3,
    },
});

export default SolarIrradianceMeter;
