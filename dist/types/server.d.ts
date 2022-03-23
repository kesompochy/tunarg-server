declare const WebSocketServer: any;
export default abstract class Server {
    wss: typeof WebSocketServer;
    connection: Array<WebSocket>;
    protected abstract _actions: {
        [K in any]: Function;
    };
    constructor(server: string | URL);
    private _typeErrorAction;
}
export {};
//# sourceMappingURL=server.d.ts.map