import { SentimentService } from './../../sentiment/sentiment.service';
import { RoomService } from '../service/room.service';
import { Server } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

export const enum MessageType {
  ADD_MESSAGE = 'addMessage',
}

export const enum EventType {
  ROOM = 'room',
  MESSAGE = 'message',
}

const roomPrefix = (id: number) => {
  return 'room_' + id;
};

@WebSocketGateway({
  cors: true,
})
export class MessageGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly SentimentService: SentimentService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(EventType.ROOM)
  handleRoomEvent(@MessageBody() data: any) {
    this.server.emit('newMassage', data);
  }

  @SubscribeMessage(EventType.MESSAGE)
  async handleMessageEvent(@MessageBody() data: any) {
    const score = this.SentimentService.analyze(data.payload.message);
    const message = await this.roomService.addMessage({
      ...data.payload,
      sentiment_score: score,
    });
    this.server.emit(roomPrefix(message.roomId), {
      type: MessageType.ADD_MESSAGE,
      payload: message,
    });
  }
}
