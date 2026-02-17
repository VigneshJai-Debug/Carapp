import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    MediaStream,
} from 'react-native-webrtc';
import { SignalingClient } from './signalingClient';
import { useAppStore } from '../store/useAppStore';

const CONFIG = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export class WebRTCClient {
    private peerConnection: RTCPeerConnection | null = null;
    private signaling: SignalingClient;
    private localStream: MediaStream | null = null;
    public onRemoteStream: ((stream: MediaStream) => void) | null = null;
    private dataChannel: any = null; // Type as 'any' for simplicity with RNWebRTC types

    constructor(signalingUrl: string) {
        this.signaling = new SignalingClient(
            signalingUrl,
            this.handleSignalingMessage.bind(this),
            this.startConnection.bind(this),
            () => useAppStore.getState().setConnectionStatus('disconnected')
        );
    }

    connect() {
        useAppStore.getState().setConnectionStatus('connecting');
        this.signaling.connect();
    }

    private async startConnection() {
        this.peerConnection = new RTCPeerConnection(CONFIG);

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.signaling.send({ type: 'candidate', candidate: event.candidate });
            }
        };

        this.peerConnection.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                if (this.onRemoteStream) {
                    this.onRemoteStream(event.streams[0]);
                }
            }
        };

        // Data Channel for Telemetry
        this.peerConnection.ondatachannel = (event) => {
            this.dataChannel = event.channel;
            this.setupDataChannel(this.dataChannel);
        };

        // If we are initiator (unlikely for viewing stream, but for symmetry)
        // const dc = this.peerConnection.createDataChannel("telemetry");
        // this.setupDataChannel(dc);

        useAppStore.getState().setConnectionStatus('connected');
    }

    private setupDataChannel(channel: any) {
        channel.onmessage = (event: any) => {
            try {
                const data = JSON.parse(event.data);
                this.handleDataMessage(data);
            } catch (e) {
                console.error("DataChannel parse error", e);
            }
        };
    }

    private handleDataMessage(data: any) {
        const store = useAppStore.getState();

        if (data.type === 'telemetry') {
            store.updateTelemetry(data.payload);
        } else if (data.type === 'detections') {
            store.updateDetections(data.payload);
        }
    }

    private async handleSignalingMessage(message: any) {
        if (!this.peerConnection) return;

        if (message.type === 'offer') {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.description));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.signaling.send({ type: 'answer', description: answer });
        } else if (message.type === 'answer') {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.description));
        } else if (message.type === 'candidate') {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }
}
