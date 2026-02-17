// This logic is currently integrated into peer.ts for simplicity of the DataChannel handler.
// Keeping this file as a placeholder if we need to split complex parsing logic later.
// For now, exporting a dummy helper to satisfy the file structure plan.

export const parseTelemetryPacket = (jsonString: string) => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
};
