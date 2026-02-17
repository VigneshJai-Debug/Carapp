import { act } from '@testing-library/react-native';
import { useAppStore } from '../src/store/useAppStore';

describe('Control Logic Integration', () => {
    beforeEach(() => {
        useAppStore.setState({
            activeModel: 'cone',
            inferenceEnabled: true,
        });
    });

    it('should switch AI models', () => {
        const store = useAppStore.getState();
        expect(store.activeModel).toBe('cone');

        act(() => {
            store.setActiveModel('pothole');
        });

        expect(useAppStore.getState().activeModel).toBe('pothole');
    });

    it('should toggle inference state', () => {
        const store = useAppStore.getState();
        expect(store.inferenceEnabled).toBe(true);

        act(() => {
            store.toggleInference();
        });

        expect(useAppStore.getState().inferenceEnabled).toBe(false);
    });
});
