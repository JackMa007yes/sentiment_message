import { SentimentModule } from './../sentiment/sentiment.module';
import { UserModule } from './../user/user.module';
import { RoomController } from './room.controller';
import { RoomService } from './service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { MessageGateway } from './gateway/message.gateway';

@Module({
  imports: [
    UserModule,
    SentimentModule,
    TypeOrmModule.forFeature([Room, Message]),
  ],
  controllers: [RoomController],
  providers: [RoomService, MessageGateway],
  exports: [RoomService],
})
export class RoomModule {}
