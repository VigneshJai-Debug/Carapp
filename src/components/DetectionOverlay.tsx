import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useAppStore } from '../store/useAppStore';

const { width, height } = Dimensions.get('window');

export const DetectionOverlay: React.FC = () => {
    const detections = useAppStore((state) => state.detections);
    const isRisk = useAppStore((state) => state.isConeCollisionRisk);

    // Animation for flashing warning
    const flashAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isRisk) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(flashAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                    Animated.timing(flashAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
                ])
            ).start();
        } else {
            flashAnim.setValue(0);
            flashAnim.stopAnimation();
        }
    }, [isRisk]);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
                {detections.map((det, index) => {
                    // Color coding: Cones = Orange, Potholes = Red
                    const color = det.class === 'cone' ? '#FFA500' : '#FF0000';

                    return (
                        <React.Fragment key={index}>
                            <Rect
                                x={det.x * width}
                                y={det.y * height}
                                width={det.w * width}
                                height={det.h * height}
                                stroke={color}
                                strokeWidth="3"
                                fill="transparent"
                            />
                            <SvgText
                                x={det.x * width}
                                y={(det.y * height) - 5}
                                fill={color}
                                fontSize="16"
                                fontWeight="bold"
                            >
                                {det.class.toUpperCase()} {Math.round(det.confidence * 100)}%
                            </SvgText>
                        </React.Fragment>
                    );
                })}
            </Svg>

            {/* Collision Warning Overlay */}
            {isRisk && (
                <Animated.View style={[styles.warningOverlay, { opacity: flashAnim }]}>
                    <Text style={styles.warningText}>⚠ CONE AHEAD</Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    warningOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    warningText: {
        color: 'white',
        fontSize: 64,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    }
});
