export class SignalingClient {
    private ws: WebSocket | null = null;
    private url: string;
    private onMessage: (message: any) => void;
    private onOpen: () => void;
    private onClose: () => void;

    constructor(url: string, onMessage: (msg: any) => void, onOpen: () => void, onClose: () => void) {
        this.url = url;
        this.onMessage = onMessage;
        this.onOpen = onOpen;
        this.onClose = onClose;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('Signaling Connected');
            this.onOpen();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.onMessage(message);
            } catch (e) {
                console.error('Signaling Message Error:', e);
            }
        };

        this.ws.onerror = (e) => {
            console.error('Signaling Error:', e);
        };

        this.ws.onclose = () => {
            console.log('Signaling Closed');
            this.onClose();
        };
    }

    send(message: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    close() {
        this.ws?.close();
    }
}
