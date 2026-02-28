import { useAppStore } from '../store/useAppStore';

const PI_URL = "http://192.168.92.121:8080";

let pollingActive = false;
let pollTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Poll /telemetry at ~2Hz and update the store.
 */
export function startTelemetryPolling() {
    if (pollingActive) return;
    pollingActive = true;
    poll();
}

export function stopTelemetryPolling() {
    pollingActive = false;
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
}

async function poll() {
    if (!pollingActive) return;

    try {
        const response = await fetch(`${PI_URL}/telemetry`);
        if (response.ok) {
            const data = await response.json();
            useAppStore.getState().updateTelemetry(data);
        }
    } catch (e) {
        // Network error — skip this cycle
    }

    if (pollingActive) {
        pollTimer = setTimeout(poll, 500); // 2Hz is plenty for dash stats
    }
}
