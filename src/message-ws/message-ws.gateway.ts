import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}
  handleConnection(client: Socket, ...args: any[]) {
    this.messageWsService.registerClient(client);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );

    console.log({ connected: this.messageWsService.getConnectedClients() });
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
      console.log({ connected: this.messageWsService.getConnectedClients() }),
    );
    // console.log('Cliente desconectado', client.id);
  }
}
