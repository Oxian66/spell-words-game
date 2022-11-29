import { Server, Socket } from 'socket.io';

import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';

import { AppService } from './app.service';
import { Letter } from './interfaces/letter';
import { Player } from './interfaces/player';

@WebSocketGateway({ cors: true })
export class SpellWordsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  clients: Socket[] = [];

  players: Player[] = [];

  isTurnNow: boolean;

  constructor(private readonly appService: AppService) {}

  handleConnection(socket: Socket) {
    this.clients = [...this.clients, socket];
    Logger.log("New websocket connection");
    Logger.log(`Clients connected: ${this.clients.length}`);
  }

  handleDisconnect(socket: Socket) {
    this.clients = this.clients.filter((client) => client !== socket);
    this.players = this.players.filter((player) => player.id !== socket.id);
    Logger.log("Websocket connection closed");
    Logger.log(`Clients connected: ${this.clients.length}`);
  }

  @SubscribeMessage("game")
  async startGame(@ConnectedSocket() socket: Socket): Promise<WsResponse<any>> {
    console.log(socket.id);
    setTimeout(() => {
      this.server.emit("players", this.players);
    }, 1000);
    return {
      data: this.appService.getLetters(),
      event: "game",
    };
  }

  @SubscribeMessage("player_input")
  async playerInput(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: Letter[]
  ) {
    const res = await this.appService.processInput(message);
    this.server.emit('disable_input', {message: false});
    if (res.isCorrect) this.server.emit("update_letters", res.letters);
    socket.emit("user_input", { isCorrect: res.isCorrect, score: res.score });
    let prevIndex;
    for (let i = 0; i < this.players.length; i++) {
      if (socket.id === this.players[i].id) { prevIndex = i; break; }
    }
    const next = this.players[prevIndex + 1 >= this.players.length ? 0 : prevIndex + 1].id;
    this.server.emit('set_player_input', { message: false });
    this.server.to(next).emit('set_player_input', { message: true });
  }

  @SubscribeMessage("get_player")
  getPlayer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() playerName: string
  ) {
    this.players.push({ id: socket.id, playerName });
    if (this.players.length === 1) {
      socket.emit('set_player_input', { message: true });
    }
  }
}
