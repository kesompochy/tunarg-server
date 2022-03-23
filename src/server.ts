const WebSocketServer = require('ws').Server;
import type ITunargProtocol from "./protocol";

export default abstract class Server{
    readonly wss: typeof WebSocketServer;
    private _actions: {
        [K in any]: Function;
    } = {};
    get actions() {
        return this._actions;
    }
    constructor(server: string | URL, actions?: {[K in any]: Function}){
        const wss = new WebSocketServer({server: server});
        this.wss = wss;

        for(let type in actions){
            this.addAction(type, actions[type]);
        }

        wss.on('connection', (ws: typeof WebSocketServer)=>{
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
    addAction(type: string, action: Function){
        this.actions[type] = action;
    }
}