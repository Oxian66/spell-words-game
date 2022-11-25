"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellWordsGateway = void 0;
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const app_service_1 = require("./app.service");
let SpellWordsGateway = class SpellWordsGateway {
    constructor(appService) {
        this.appService = appService;
        this.clients = [];
        this.playersNames = [];
    }
    handleConnection(socket) {
        this.clients = [...this.clients, socket];
        common_1.Logger.log('New websocket connection');
        common_1.Logger.log(`Clients connected: ${this.clients.length}`);
    }
    handleDisconnect(socket) {
        this.clients = this.clients.filter((client) => client !== socket);
        this.playersNames = this.playersNames.filter(player => player.id !== socket.id);
        common_1.Logger.log('Websocket connection closed');
        common_1.Logger.log(`Clients connected: ${this.clients.length}`);
    }
    async startGame(socket) {
        console.log(socket.id);
        setTimeout(() => { this.server.emit('players', this.playersNames); }, 1000);
        return {
            data: this.appService.getLetters(),
            event: 'game',
        };
    }
    async playerInput(socket, message) {
        const res = await this.appService.processInput(message);
        if (res.isCorrect)
            this.server.emit('update_letters', res.letters);
        socket.emit('user_input', { isCorrect: res.isCorrect, score: res.score });
    }
    getPlayer(socket, playerName) {
        this.playersNames.push({ id: socket.id, playerName });
        console.log('players', this.playersNames);
    }
    async playerTurn(socket) {
        return this.appService;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SpellWordsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('game'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SpellWordsGateway.prototype, "startGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player_input'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Array]),
    __metadata("design:returntype", Promise)
], SpellWordsGateway.prototype, "playerInput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_player'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], SpellWordsGateway.prototype, "getPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('user_move'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SpellWordsGateway.prototype, "playerTurn", null);
SpellWordsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [app_service_1.AppService])
], SpellWordsGateway);
exports.SpellWordsGateway = SpellWordsGateway;
//# sourceMappingURL=spell_words.gateway.js.map