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

@WebSocketGateway({ cors: true })
export class SpellWordsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  clients: Socket[] = [];
  constructor(private readonly appService: AppService) {}

  handleConnection(socket: Socket) {
    this.clients = [...this.clients, socket];
    Logger.log('New websocket connection');
    Logger.log(`Clients connected: ${this.clients.length}`);
  }

  handleDisconnect(socket: Socket) {
    this.clients = this.clients.filter((client) => client !== socket);
    Logger.log('Websocket connection closed');
    Logger.log(`Clients connected: ${this.clients.length}`);
  }

  @SubscribeMessage('game')
  async startGame(@ConnectedSocket() socket: Socket): Promise<WsResponse<any>> {
    console.log(socket.id);
    socket.emit('lol');
    return {
      data: this.appService.getLetters(),
      event: 'game',
    };
  }

  @SubscribeMessage('player_input')
  async playerInput(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: Letter[],
  ) {
    const res = await this.appService.processInput(message);
    if (res.isCorrect) this.server.emit('update_letters', res.letters);
    socket.emit('user_input', { isCorrect: res.isCorrect, score: res.score });
  }

  // @SubscribeMessage('lock_letter')
  // async lockLetter(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() letter: Letter
  // ) {
  // }
}
