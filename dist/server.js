"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketServer = require('ws').Server;
var Server = /** @class */ (function () {
    function Server(server) {
        var _this = this;
        this.connection = [];
        var wss = new WebSocketServer({ server: server });
        this.wss = wss;
        wss.on('connection', function (ws) {
            _this.connection.push(ws);
            ws.on('message', function (mes) {
                var json = JSON.parse(mes);
                var type = json.type;
                var content = json.content;
                if (_this._actions[type]) {
                    _this._actions[type].bind(_this)(ws, content);
                }
                else {
                    _this._typeErrorAction(ws, type);
                }
            });
        });
    }
    Server.prototype._typeErrorAction = function (ws, type) {
        ws.send(JSON.stringify({ type: 'error', content: "there is no transmission type \"".concat(type, "\".") }));
    };
    return Server;
}());
exports.default = Server;
