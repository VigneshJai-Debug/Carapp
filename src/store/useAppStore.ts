import { create } from 'zustand';

// Types
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface Telemetry {
    speed: number;        // km/h
    batteryPercent: number; // 0-100
    consumption: number;  // kW
    range: number;        // km (derived or received)
}

export interface Detection {
    class: 'cone' | 'pothole';
    confidence: number;
    x: number; // Normalized 0-1
    y: number; // Normalized 0-1
    w: number; // Normalized 0-1
    h: number; // Normalized 0-1
}

export interface MapState {
    latitude: number;
    longitude: number;
    heading: number;
    pathHistory: Array<{ latitude: number; longitude: number }>; // For polyline
}

export interface AppState {
    // Connection
    connectionStatus: ConnectionStatus;
    setConnectionStatus: (status: ConnectionStatus) => void;

    // AI & Controls
    activeModel: 'cone' | 'pothole';
    inferenceEnabled: boolean;
    setActiveModel: (model: 'cone' | 'pothole') => void;
    toggleInference: () => void;

    // Telemetry
    telemetry: Telemetry;
    updateTelemetry: (data: Partial<Telemetry>) => void;

    // Detections & Safety
    detections: Detection[];
    isConeCollisionRisk: boolean;
    updateDetections: (detections: Detection[]) => void;

    // Map
    mapState: MapState;
    updateMapState: (data: Partial<MapState>) => void;
}

// Helper for collision risk
const CONE_DANGER_ROI = {
    xMin: 0.35,
    xMax: 0.65,
    yMin: 0.55,
    yMax: 1.0,
};

let consecutiveRiskFrames = 0;

export const useAppStore = create<AppState>((set) => ({
    // Initial State
    connectionStatus: 'disconnected',

    activeModel: 'cone',
    inferenceEnabled: true,

    telemetry: {
        speed: 0,
        batteryPercent: 100,
        consumption: 0,
        range: 0,
    },

    detections: [],
    isConeCollisionRisk: false,

    mapState: {
        latitude: 0,
        longitude: 0,
        heading: 0,
        pathHistory: [],
    },

    // Actions
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    setActiveModel: (model) => set({ activeModel: model }),

    toggleInference: () => set((state) => ({ inferenceEnabled: !state.inferenceEnabled })),

    updateTelemetry: (data) => set((state) => ({
        telemetry: { ...state.telemetry, ...data }
    })),

    updateDetections: (detections) => set((state) => {
        // Collision Logic Calculation
        let riskDetected = false;

        // Check if any cone is in danger zone
        const hazard = detections.find(d =>
            d.class === 'cone' &&
            d.confidence > 0.6 &&
            (d.w * d.h) > 0.02 && // Area > 2%
            // Simple intersection check (center point in ROI for simplicity or bbox overlap)
            // Strictly checking if center is in ROI gives fewer false positives, 
            // but checking overlap is safer. Let's use overlap logic or simpler "center + size" logic.
            // Requirement: "bounding box intersects danger zone"
            !((d.x + d.w < CONE_DANGER_ROI.xMin) || // box is left of ROI
                (d.x > CONE_DANGER_ROI.xMax) ||       // box is right of ROI
                (d.y + d.h < CONE_DANGER_ROI.yMin) || // box is above ROI
                (d.y > CONE_DANGER_ROI.yMax))         // box is below ROI (unlikely given yMax=1)
        );

        if (hazard) {
            consecutiveRiskFrames++;
        } else {
            consecutiveRiskFrames = 0;
        }

        // Trigger warning if >= 3 frames
        riskDetected = consecutiveRiskFrames >= 3;

        return {
            detections,
            isConeCollisionRisk: riskDetected
        };
    }),

    updateMapState: (data) => set((state) => {
        // Append to path history if position changed significantly (optional optimization)
        // For now, simple append
        const newHistory = [...state.mapState.pathHistory];
        if (data.latitude && data.longitude) {
            // Only add if we have a valid fix (simple check)
            if (newHistory.length === 0 ||
                (Math.abs(newHistory[newHistory.length - 1].latitude - data.latitude) > 0.0001 ||
                    Math.abs(newHistory[newHistory.length - 1].longitude - data.longitude) > 0.0001)) {
                newHistory.push({ latitude: data.latitude, longitude: data.longitude });
                // Keep history limited to prevent memory sensing? Requirement says "last ~2 minutes".
                // Assuming 1Hz gps, 120 points.
                if (newHistory.length > 200) newHistory.shift();
            }
        }

        return {
            mapState: {
                ...state.mapState,
                ...data,
                pathHistory: newHistory
            }
        };
    }),
}));
