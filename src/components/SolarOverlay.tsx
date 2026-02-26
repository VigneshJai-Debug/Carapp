import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    ScrollView,
} from 'react-native';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';
import { useAppStore, SolarHistoryEntry } from '../store/useAppStore';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = Math.min(SCREEN_W * 0.82, 640);

// Fixed SVG dimensions — no dynamic calculation, no guesswork
const SVG_W = CARD_W - 32;       // card padding (16*2)
const SVG_H = 160;               // fixed graph SVG height
const PLOT_L = 52;               // left edge of plot area (room for Y labels)
const PLOT_R = SVG_W - 16;       // right edge of plot area
const PLOT_T = 14;               // top edge of plot area
const PLOT_B = SVG_H - 36;       // bottom edge (room for X labels below)
const PLOT_W = PLOT_R - PLOT_L;  // actual drawing width
const PLOT_H = PLOT_B - PLOT_T;  // actual drawing height

/**
 * Expanded solar overlay — shows irradiance history graph.
 * Closes only via the X button (driver-safe).
 */

function buildPoints(history: SolarHistoryEntry[]): { points: string; maxGhi: number; minGhi: number } {
    if (history.length === 0) return { points: '', maxGhi: 100, minGhi: 0 };

    const vals = history.map((e) => e.ghi);
    const rawMax = Math.max(...vals);
    const rawMin = Math.min(...vals);
    const maxGhi = Math.max(rawMax, 100);
    const minGhi = Math.min(rawMin, 0);
    const range = maxGhi - minGhi || 1;

    // 8% inner padding so lines at 0 or max don't sit exactly on the edge
    const pad = PLOT_H * 0.08;
    const drawH = PLOT_H - pad * 2;

    const pts = history
        .map((entry, i) => {
            const x = PLOT_L + (i / Math.max(history.length - 1, 1)) * PLOT_W;
            const y = PLOT_T + pad + drawH - ((entry.ghi - minGhi) / range) * drawH;
            return `${x},${y}`;
        })
        .join(' ');

    return { points: pts, maxGhi, minGhi };
}

const SolarOverlay: React.FC = () => {
    const visible = useAppStore((s) => s.solarOverlayVisible);
    const setSolarOverlayVisible = useAppStore((s) => s.setSolarOverlayVisible);
    const solarIrradiance = useAppStore((s) => s.solarIrradiance);
    const solarHistory = useAppStore((s) => s.solarHistory);
    const instability = useAppStore((s) => s.solarInstability);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 0.92, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            setSolarOverlayVisible(false);
        });
    };

    if (!visible) return null;

    const { points, maxGhi, minGhi } = buildPoints(solarHistory);
    const midGhi = Math.round((maxGhi + minGhi) / 2);

    // Time labels (minutes ago)
    const timeLabels: { label: string; x: number }[] = [];
    if (solarHistory.length > 1) {
        const now = solarHistory[solarHistory.length - 1].timestamp;
        const indices = [0, Math.floor(solarHistory.length / 2), solarHistory.length - 1];
        indices.forEach((idx) => {
            const minsAgo = Math.round((now - solarHistory[idx].timestamp) / 60000);
            const x = PLOT_L + (idx / Math.max(solarHistory.length - 1, 1)) * PLOT_W;
            timeLabels.push({ label: minsAgo === 0 ? 'Now' : `-${minsAgo}m`, x });
        });
    }

    const instabilityPct = Math.round(instability * 100);

    return (
        <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
            <View style={styles.backdrop}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* ── Header ── */}
                    <View style={styles.header}>
                        <Text style={styles.title}>☀  Solar Irradiance History</Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={handleClose}
                            activeOpacity={0.6}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Graph ── */}
                    {solarHistory.length < 2 ? (
                        <View style={styles.noDataBox}>
                            <Text style={styles.noDataText}>Waiting for data…</Text>
                            <Text style={styles.noDataSub}>
                                Solar readings will appear as they arrive.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.graphBox}>
                            <Svg width={SVG_W} height={SVG_H}>
                                {/* ── Reference lines ── */}
                                <Line x1={PLOT_L} y1={PLOT_T} x2={PLOT_R} y2={PLOT_T}
                                    stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                <Line x1={PLOT_L} y1={(PLOT_T + PLOT_B) / 2} x2={PLOT_R} y2={(PLOT_T + PLOT_B) / 2}
                                    stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
                                <Line x1={PLOT_L} y1={PLOT_B} x2={PLOT_R} y2={PLOT_B}
                                    stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                                {/* ── Y-axis values ── */}
                                <SvgText x={PLOT_L - 6} y={PLOT_T + 4}
                                    fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">
                                    {Math.round(maxGhi)}
                                </SvgText>
                                <SvgText x={PLOT_L - 6} y={(PLOT_T + PLOT_B) / 2 + 3}
                                    fill="rgba(255,255,255,0.35)" fontSize="10" textAnchor="end">
                                    {midGhi}
                                </SvgText>
                                <SvgText x={PLOT_L - 6} y={PLOT_B + 4}
                                    fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">
                                    {Math.round(minGhi)}
                                </SvgText>

                                {/* ── Y-axis title ── */}
                                <SvgText x={12} y={(PLOT_T + PLOT_B) / 2}
                                    fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="600"
                                    textAnchor="middle" rotation={-90}
                                    originX={12} originY={(PLOT_T + PLOT_B) / 2}>
                                    W/m²
                                </SvgText>

                                {/* ── Data line ── */}
                                <Polyline
                                    points={points}
                                    fill="none"
                                    stroke="#30D158"
                                    strokeWidth="2.5"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />

                                {/* ── X-axis time labels ── */}
                                {timeLabels.map((tl, i) => (
                                    <SvgText key={i} x={tl.x} y={PLOT_B + 16}
                                        fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                                        {tl.label}
                                    </SvgText>
                                ))}

                                {/* ── X-axis title ── */}
                                <SvgText x={(PLOT_L + PLOT_R) / 2} y={PLOT_B + 30}
                                    fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="600"
                                    textAnchor="middle">
                                    Time
                                </SvgText>
                            </Svg>
                        </View>
                    )}

                    {/* ── Bottom badges ── */}
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeLabel}>GHI</Text>
                            <Text style={styles.badgeValue}>{Math.round(solarIrradiance.ghi)}</Text>
                            <Text style={styles.badgeUnit}>W/m²</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeLabel}>DNI</Text>
                            <Text style={styles.badgeValue}>{Math.round(solarIrradiance.dni)}</Text>
                            <Text style={styles.badgeUnit}>W/m²</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeLabel}>DHI</Text>
                            <Text style={styles.badgeValue}>{Math.round(solarIrradiance.dhi)}</Text>
                            <Text style={styles.badgeUnit}>W/m²</Text>
                        </View>
                        <View style={[styles.badge, styles.instabilityBadge]}>
                            <Text style={styles.badgeLabel}>INSTABILITY</Text>
                            <Text style={[styles.badgeValue, { color: instabilityPct > 50 ? '#FF453A' : instabilityPct > 25 ? '#FFD60A' : '#30D158' }]}>
                                {instabilityPct}%
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: CARD_W,
        backgroundColor: '#1a1a1a',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: 'rgba(255,255,255,0.88)',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '600',
    },
    graphBox: {
        alignItems: 'center',
        marginBottom: 10,
    },
    noDataBox: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noDataText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
    },
    noDataSub: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 10,
        marginTop: 4,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
    },
    badge: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    instabilityBadge: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    badgeLabel: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    badgeValue: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
    },
    badgeUnit: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 8,
        fontWeight: '600',
    },
});

export default SolarOverlay;
