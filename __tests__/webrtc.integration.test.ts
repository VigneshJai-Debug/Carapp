import { act } from '@testing-library/react-native';
import { WebRTCClient } from '../src/webrtc/peer';
import { useAppStore } from '../src/store/useAppStore';

// Mock WebRTC
jest.mock('react-native-webrtc', () => ({
    RTCPeerConnection: jest.fn().mockImplementation(() => ({
        onicecandidate: null,
        ontrack: null,
        ondatachannel: null,
        createAnswer: jest.fn(() => Promise.resolve({ sdp: 'mock-answer', type: 'answer' })),
        setLocalDescription: jest.fn(() => Promise.resolve()),
        setRemoteDescription: jest.fn(() => Promise.resolve()),
        addIceCandidate: jest.fn(() => Promise.resolve()),
    })),
    RTCSessionDescription: jest.fn(),
    RTCIceCandidate: jest.fn(),
}));

// Mock WebSocket
const mockSend = jest.fn();
class MockWebSocket {
    onopen: () => void = () => { };
    onmessage: (event: any) => void = () => { };
    send: (data: any) => void = mockSend;
    readyState: number = 1; // Open
    constructor(url: string) {
        setTimeout(() => this.onopen(), 10);
    }
}
(global as any).WebSocket = MockWebSocket;

describe('WebRTC Integration Flow', () => {
    let client: WebRTCClient;

    beforeEach(() => {
        useAppStore.setState({ connectionStatus: 'disconnected' });
        jest.clearAllMocks();
        client = new WebRTCClient('ws://test-url');
    });

    it('should connect to signaling and update status', async () => {
        expect(useAppStore.getState().connectionStatus).toBe('disconnected');

        await act(async () => {
            client.connect();
        });

        // Wait for mock websocket to open
        await new Promise(resolve => setTimeout(resolve, 20));

        // After signaling connects, it should trigger peer connection start
        // which sets status to connected in our implementation logic:
        // connect() -> signaling.connect() -> onOpen() -> startConnection() -> setStatus('connected')
        expect(useAppStore.getState().connectionStatus).toBe('connected');
    });
});
