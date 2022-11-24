import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { AppService } from './app.service';
import { Letter } from './interfaces/letter';
export declare class SpellWordsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly appService;
    server: Server;
    clients: Socket[];
    constructor(appService: AppService);
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    startGame(socket: Socket): Promise<WsResponse<any>>;
    playerInput(socket: Socket, message: Letter[]): Promise<void>;
}
