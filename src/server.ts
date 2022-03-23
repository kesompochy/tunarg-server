const WebSocketServer = require('ws').Server;
import type ITunargProtocol from "./protocol";

type actionFunction = (ws: WebSocket, content?: any)=>{};

export default abstract class Server{
    readonly wss: typeof WebSocketServer;
    private _connection: Array<WebSocket> = [];
    get connection(){
        return this._connection;
    }
    private _actions: {
        [K in any]: actionFunction;
    } = {};
    get actions() {
        return this._actions;
    }
    constructor(server: string | URL){
        const wss = new WebSocketServer({server: server});
        this.wss = wss;

        wss.on('connection', (ws: typeof WebSocketServer)=>{
            this._connection.push(ws);
            ws.on('message', (mes: any)=>{
                
                const json: ITunargProtocol = JSON.parse(mes);
                const type = json.type;
                const content = json.content;

                if(this._actions[type]){
                    this._actions[type].bind(this)(ws, content);
                } else {
                    this._typeErrorAction(ws, type);
                }
            });
        });
    }
    private _typeErrorAction(ws: WebSocket, type: string){
        ws.send(JSON.stringify({type: 'error', content: `there is no transmission type "${type}".`}));
    }
    send(ws: WebSocket, type: string, content: any){
        ws.send(JSON.stringify({type: type, content: content}));
    }
    addAction(type: string, action: actionFunction){
        this.actions[type] = action;
    }
}