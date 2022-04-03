"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketServer = require('ws').Server;
var Server = /** @class */ (function () {
    function Server(server, actions) {
        var _this = this;
        this._actions = {};
        var wss = new WebSocketServer({ server: server });
        this.wss = wss;
        for (var type in actions) {
            this.addAction(type, actions[type]);
        }
        wss.on('connection', function (ws) {
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
    Object.defineProperty(Server.prototype, "actions", {
        get: function () {
            return this._actions;
        },
        enumerable: false,
        configurable: true
    });
    Server.prototype._typeErrorAction = function (ws, type) {
        ws.send(JSON.stringify({ type: 'error', content: "there is no transmission type \"".concat(type, "\".") }));
    };
    Server.prototype.send = function (ws, type, content) {
        ws.send(JSON.stringify({ type: type, content: content }));
    };
    Server.prototype.addAction = function (type, action) {
        this.actions[type] = action;
    };
    return Server;
}());
exports.default = Server;
