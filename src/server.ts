const WebSocketServer = require('ws').Server;
import type ITunargProtocol from "./protocol";

export default abstract class Server{
    wss: typeof WebSocketServer;
    connection: Array<WebSocket> = [];
    protected abstract _actions: {
        [K in any]: Function;
    };
    constructor(server: string | URL){
        const wss = new WebSocketServer({server: server});
        this.wss = wss;

        wss.on('connection', (ws: typeof WebSocketServer)=>{
            this.connection.push(ws);
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
}