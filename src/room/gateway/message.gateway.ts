import { BadRequestWsExceptionFilter } from './../../common/filter/bad-request-ws-exception.filter';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { JoinRoomDto } from './../dto/join-room.dto';
import { LeaveRoomDto } from './../dto/leave-room.dto';
import { RoomService } from '../service/room.service';
import { AuthService } from './../../auth/auth.service';
import { MessageEventDto } from './../dto/message-event.dto';
import { SessionService } from './../../session/session.service';
import {
  MessageEventType,
  SessionEventType,
  EventType,
} from 'src/constants/socket';

const DEFAULT_PAGINATION = {
  limit: 10,
  page: 1,
};

@UseFilters(new BadRequestWsExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: true,
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly roomService: RoomService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    const token = client.handshake.query.token as string;
    const payload = await this.authService.verifyAccessToken(token);
    (client as any).$metaData = { userId: payload.sub };
  }

  async handleDisconnect(): Promise<void> {
    // Noop
  }

  @SubscribeMessage(EventType.JOIN_ROOM)
  async onRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinRoomDto: JoinRoomDto,
  ) {
    const { roomId } = joinRoomDto;
    const room = await this.roomService.findOne(roomId);
    if (!room) {
      return new WsException(`room ${roomId} not exist`);
    }

    const roomList = Array.from(client.rooms).filter(
      (item) => item !== client.id,
    );
    if (roomList.length) {
      roomList.forEach((roomId) => client.leave(roomId));
    }
    client.join(String(roomId));

    // const messages = await this.roomService.getMessage(
    //   roomId,
    //   DEFAULT_PAGINATION,
    // );
    // client.emit(EventType.MESSAGE, messages);
  }

  @SubscribeMessage(EventType.LEAVE_ROOM)
  async onRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() leaveRoomDto: LeaveRoomDto,
  ) {
    const { roomId } = leaveRoomDto;
    const room = await this.roomService.findOne(roomId);
    if (!room) {
      return new WsException(`room ${roomId} not exist`);
    }
    client.leave(String(roomId));
  }

  @SubscribeMessage(EventType.MESSAGE)
  async handleMessageEvent(
    @MessageBody() data: MessageEventDto,
    // @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, message } = data.payload;
    const newMessage = await this.roomService.addMessage(data.payload);

    const room = await this.roomService.findOneWithSession(roomId);

    room.sessions.forEach(async (session) => {
      if (session.fromUser.id === userId) {
        this.sessionService.updateInSession({
          id: session.id,
          lastMessage: message,
        });
        this.server.to(String(roomId)).emit(EventType.MESSAGE, {
          type: MessageEventType.ADD_MESSAGE,
          payload: newMessage,
        });
      } else {
        if (this.checkInRoom(session.fromUser.id, roomId)) {
          // 在当前对话中
          this.sessionService.updateInSession({
            id: session.id,
            lastMessage: message,
          });
          this.server.to(String(roomId)).emit(EventType.MESSAGE, {
            type: MessageEventType.ADD_MESSAGE,
            payload: newMessage,
          });
        } else if (this.checkConnectState(session.fromUser.id)) {
          // 在线 但是不在当前会话
          const newSession = await this.sessionService.update({
            id: session.id,
            lastMessage: message,
          });
          this.server.to(String(roomId)).emit(EventType.SESSION, {
            type: SessionEventType.UPDATE,
            payload: {
              sessionId: session.id,
              message: newMessage,
              updateAt: newSession.lastMessageTime,
            },
          });
        } else {
          // 离线
          this.sessionService.update({
            id: session.id,
            lastMessage: message,
          });
        }
      }
    });
  }

  private checkConnectState(userId: number) {
    let res = false;
    this.server.sockets.sockets.forEach((value: any) => {
      if (value.$metaData.userId === userId) res = true;
    });
    return res;
  }

  private checkInRoom(userId: number, roomId: number) {
    const roomMemberSet = this.server.sockets.adapter.rooms.get(String(roomId));
    let res = false;
    roomMemberSet &&
      roomMemberSet.forEach((value: any) => {
        if (
          (this.server.sockets.sockets.get(value) as any).$metaData.userId ===
          userId
        )
          res = true;
      });
    return res;
  }
}
