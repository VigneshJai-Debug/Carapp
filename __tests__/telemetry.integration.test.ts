import { act } from '@testing-library/react-native';
import { useAppStore } from '../src/store/useAppStore';

describe('Telemetry & Collision Integration', () => {
    beforeEach(() => {
        useAppStore.setState({
            telemetry: { speed: 0, batteryPercent: 100, consumption: 0, range: 0 },
            detections: [],
            isConeCollisionRisk: false,
            connectionStatus: 'connected'
        });
    });

    it('should update telemetry state correctly', () => {
        const update = { speed: 85, batteryPercent: 92 };

        act(() => {
            useAppStore.getState().updateTelemetry(update);
        });

        const state = useAppStore.getState().telemetry;
        expect(state.speed).toBe(85);
        expect(state.batteryPercent).toBe(92);
    });

    it('should trigger collision warning only after 3 consecutive risk frames', () => {
        // Defines a detection in the danger zone (35-65% width, >55% height)
        const dangerousCone = {
            class: 'cone' as const,
            confidence: 0.9,
            x: 0.45, // Center horizontal
            y: 0.8,  // Low down (close)
            w: 0.2,
            h: 0.2
        };

        const safeCone = {
            class: 'cone' as const,
            confidence: 0.9,
            x: 0.1, // Far left
            y: 0.8,
            w: 0.1,
            h: 0.1
        };

        // Frame 1: Risk
        act(() => useAppStore.getState().updateDetections([dangerousCone]));
        expect(useAppStore.getState().isConeCollisionRisk).toBe(false);

        // Frame 2: Risk
        act(() => useAppStore.getState().updateDetections([dangerousCone]));
        expect(useAppStore.getState().isConeCollisionRisk).toBe(false);

        // Frame 3: Risk -> Warning Triggered!
        act(() => useAppStore.getState().updateDetections([dangerousCone]));
        expect(useAppStore.getState().isConeCollisionRisk).toBe(true);

        // Frame 4: Safe -> Warning Cleared
        act(() => useAppStore.getState().updateDetections([safeCone]));
        expect(useAppStore.getState().isConeCollisionRisk).toBe(false);
    });

    it('should ignore collisions for potholes or low confidence', () => {
        const potholeInZone = {
            class: 'pothole' as const,
            confidence: 0.9,
            x: 0.5,
            y: 0.8,
            w: 0.3,
            h: 0.3
        };

        // 5 consecutive frames of pothole
        for (let i = 0; i < 5; i++) {
            act(() => useAppStore.getState().updateDetections([potholeInZone]));
        }

        expect(useAppStore.getState().isConeCollisionRisk).toBe(false);
    });
});
