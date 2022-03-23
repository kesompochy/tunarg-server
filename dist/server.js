"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocketServer = require('ws').Server;
class Server {
    constructor(server) {
        this.connection = [];
        const wss = new WebSocketServer({ server: server });
        this.wss = wss;
        wss.on('connection', (ws) => {
            this.connection.push(ws);
            ws.on('message', (mes) => {
                const json = JSON.parse(mes);
                const type = json.type;
                const content = json.content;
                if (this._actions[type]) {
                    this._actions[type].bind(this)(ws, content);
                }
                else {
                    this._typeErrorAction(ws, type);
                }
            });
        });
    }
    _typeErrorAction(ws, type) {
        ws.send(JSON.stringify({ type: 'error', content: `there is no transmission type "${type}".` }));
    }
}
exports.default = Server;
