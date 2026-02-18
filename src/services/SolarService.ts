/**
 * Solar Irradiance Service
 * Polls Open-Meteo API for real-time solar radiation data.
 * Uses the device's GPS coordinates — no API key needed.
 */

import { useAppStore } from '../store/useAppStore';

const POLL_INTERVAL_MS = 60_000; // 60 seconds

let pollTimer: ReturnType<typeof setInterval> | null = null;

async function fetchSolarData(lat: number, lng: number) {
    try {
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
            `&current=shortwave_radiation,direct_radiation,diffuse_radiation` +
            `&timezone=auto`;

        const res = await fetch(url);
        if (!res.ok) {
            console.warn('Solar API error:', res.status);
            return;
        }

        const data = await res.json();
        const current = data?.current;

        if (current) {
            useAppStore.getState().updateSolarIrradiance({
                ghi: current.shortwave_radiation ?? 0,  // W/m²
                dni: current.direct_radiation ?? 0,
                dhi: current.diffuse_radiation ?? 0,
                lastUpdated: Date.now(),
            });
        }
    } catch (err) {
        console.warn('Solar fetch failed:', err);
    }
}

export function startSolarPolling() {
    if (pollTimer) return;

    // Immediate first fetch
    const { mapState } = useAppStore.getState();
    if (mapState.latitude !== 0) {
        fetchSolarData(mapState.latitude, mapState.longitude);
    }

    pollTimer = setInterval(() => {
        const { mapState } = useAppStore.getState();
        if (mapState.latitude !== 0) {
            fetchSolarData(mapState.latitude, mapState.longitude);
        }
    }, POLL_INTERVAL_MS);
}

export function stopSolarPolling() {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
}
