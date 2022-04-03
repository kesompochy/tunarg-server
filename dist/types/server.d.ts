declare const WebSocketServer: any;
export default abstract class Server {
    readonly wss: typeof WebSocketServer;
    private _actions;
    get actions(): {
        [x: string]: Function;
        [x: number]: Function;
        [x: symbol]: Function;
    };
    constructor(server: string | URL, actions?: {
        [K in any]: Function;
    });
    private _typeErrorAction;
    send(ws: WebSocket, type: string, content: any): void;
    addAction(type: string, action: Function): void;
}
export {};
//# sourceMappingURL=server.d.ts.map