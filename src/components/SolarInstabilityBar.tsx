import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Compact tappable "Solar Stability" bar for the racing HUD.
 * Fill color maps instability 0→1 as green→yellow→red.
 * Tap to expand the full solar overlay.
 */

function getBarColor(instability: number): string {
    // 0 = green (#30D158), 0.5 = yellow (#FFD60A), 1 = red (#FF453A)
    if (instability <= 0.25) return '#30D158';
    if (instability <= 0.5) return '#FFD60A';
    if (instability <= 0.75) return '#FF9500';
    return '#FF453A';
}

function getStabilityLabel(instability: number): string {
    if (instability <= 0.25) return 'STABLE';
    if (instability <= 0.5) return 'MODERATE';
    if (instability <= 0.75) return 'UNSTABLE';
    return 'ERRATIC';
}

const SolarInstabilityBar: React.FC = () => {
    const instability = useAppStore((s) => s.solarInstability);
    const setSolarOverlayVisible = useAppStore((s) => s.setSolarOverlayVisible);
    const ghi = useAppStore((s) => s.solarIrradiance.ghi);

    const fillPct = Math.max(5, Math.min(100, (1 - instability) * 100)); // invert: stable = full
    const barColor = getBarColor(instability);
    const label = getStabilityLabel(instability);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => setSolarOverlayVisible(true)}
            activeOpacity={0.7}
        >
            {/* Icon + label row */}
            <View style={styles.labelRow}>
                <Text style={styles.icon}>☀</Text>
                <Text style={styles.label}>SOLAR</Text>
                <Text style={[styles.statusLabel, { color: barColor }]}>{label}</Text>
            </View>

            {/* Bar track */}
            <View style={styles.barTrack}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${fillPct}%` as any,
                            backgroundColor: barColor,
                        },
                    ]}
                />
            </View>

            {/* Small GHI readout */}
            <Text style={styles.ghiText}>{Math.round(ghi)} W/m²</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        width: 150,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        fontSize: 11,
        marginRight: 4,
    },
    label: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
        marginRight: 6,
    },
    statusLabel: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    barTrack: {
        height: 5,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 3,
    },
    ghiText: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 8,
        fontWeight: '600',
        marginTop: 3,
        textAlign: 'right',
    },
});

export default SolarInstabilityBar;
