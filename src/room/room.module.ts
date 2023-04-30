import { SessionModule } from './../session/session.module';
import { SentimentModule } from './../sentiment/sentiment.module';
import { UserModule } from './../user/user.module';
import { RoomController } from './room.controller';
import { RoomService } from './service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { MessageGateway } from './gateway/message.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { Session } from 'src/session/entities/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Message, Session]),
    UserModule,
    SentimentModule,
    SessionModule,
    AuthModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, MessageGateway],
  exports: [RoomService],
})
export class RoomModule {}
