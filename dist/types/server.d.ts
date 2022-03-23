declare const WebSocketServer: any;
declare type actionFunction = (ws: WebSocket, content?: any) => {};
export default abstract class Server {
    readonly wss: typeof WebSocketServer;
    private _actions;
    get actions(): {
        [x: string]: actionFunction;
        [x: number]: actionFunction;
        [x: symbol]: actionFunction;
    };
    constructor(server: string | URL);
    private _typeErrorAction;
    send(ws: WebSocket, type: string, content: any): void;
    addAction(type: string, action: actionFunction): void;
}
export {};
//# sourceMappingURL=server.d.ts.map