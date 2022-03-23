const WebSocketServer = require('ws').Server;
export default class Server {
    constructor(server) {
        this._actions = {};
        const wss = new WebSocketServer({ server: server });
        this.wss = wss;
        wss.on('connection', (ws) => {
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
    get actions() {
        return this._actions;
    }
    _typeErrorAction(ws, type) {
        ws.send(JSON.stringify({ type: 'error', content: `there is no transmission type "${type}".` }));
    }
    send(ws, type, content) {
        ws.send(JSON.stringify({ type: type, content: content }));
    }
    addAction(type, action) {
        this.actions[type] = action;
    }
}
