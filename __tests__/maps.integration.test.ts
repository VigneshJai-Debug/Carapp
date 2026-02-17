import { act } from '@testing-library/react-native';
import { useAppStore } from '../src/store/useAppStore';

describe('Map & GPS Integration', () => {
    beforeEach(() => {
        useAppStore.setState({
            mapState: {
                latitude: 0,
                longitude: 0,
                heading: 0,
                pathHistory: []
            }
        });
    });

    it('should update vehicle position and heading', () => {
        const update = { latitude: 37.7749, longitude: -122.4194, heading: 180 };

        act(() => {
            useAppStore.getState().updateMapState(update);
        });

        const state = useAppStore.getState().mapState;
        expect(state.latitude).toBe(37.7749);
        expect(state.longitude).toBe(-122.4194);
        expect(state.heading).toBe(180);
    });

    it('should append location to path history if it changed', () => {
        // Initial Position
        act(() => useAppStore.getState().updateMapState({ latitude: 10.0, longitude: 10.0 }));

        let history = useAppStore.getState().mapState.pathHistory;
        expect(history.length).toBe(1);
        expect(history[0]).toEqual({ latitude: 10.0, longitude: 10.0 });

        // New Position (different)
        act(() => useAppStore.getState().updateMapState({ latitude: 10.01, longitude: 10.01 }));

        history = useAppStore.getState().mapState.pathHistory;
        expect(history.length).toBe(2);

        // Same Position (should ignore or minimal change filter)
        // Our logic has a threshold of 0.0001
        // 10.01 vs 10.01 is diff 0.
        act(() => useAppStore.getState().updateMapState({ latitude: 10.01, longitude: 10.01 }));
        history = useAppStore.getState().mapState.pathHistory;
        expect(history.length).toBe(2);
    });
});
