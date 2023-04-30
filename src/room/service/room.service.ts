import { SentimentService } from './../../sentiment/sentiment.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { Message } from '../entities/message.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Room } from '../entities/room.entity';
import { UserService } from 'src/user/service/user.service';
import { Session } from 'src/session/entities/session.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly sentimentService: SentimentService,
  ) {}

  async findAll(paginationQuery?: PaginationQueryDto) {
    const { limit, page } = paginationQuery || {};
    const userData = await this.dataSource
      .getRepository(Room)
      .createQueryBuilder('room')
      .skip(page ? (page - 1) * limit : undefined)
      .take(limit)
      .getManyAndCount();

    return { data: userData[0], limit, page, total: userData[1] };
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOne({
      where: {
        id,
      },
    });
    if (!room) {
      throw new NotFoundException('not found');
    }
    return room;
  }

  async findOneWithSession(id: number) {
    const room = await this.roomRepository.findOne({
      where: {
        id,
      },
      relations: {
        sessions: {
          fromUser: true,
          toUser: true,
        },
      },
    });
    if (!room) {
      throw new NotFoundException('not found');
    }
    return room;
  }

  async findByUserId(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const roomIds = await queryRunner.query(
      `
        SELECT "roomId"
        FROM "user_rooms_room"
        WHERE "user_rooms_room"."userId" = ${id}
        ORDER BY "roomId"
      `,
      [],
    );
    await queryRunner.release();
    return roomIds;
  }

  async create(createRoomDto: CreateRoomDto) {
    const users = await this.userService.findByIdList(createRoomDto.users);
    // TODO
    const rooms = await this.roomRepository.find({
      relations: { users: true },
      where: [
        {
          users: { id: In(createRoomDto.users) },
        },
      ],
    });
    const existRoom = rooms.some((room) => {
      if (room.users.length !== createRoomDto.users.length) return false;
      return room.users.every((user) => createRoomDto.users.includes(user.id));
    });

    if (existRoom) {
      throw new HttpException(`room has been created`, HttpStatus.CONFLICT);
    }

    const fromSession = new Session();
    fromSession.toUser = users[1];
    fromSession.fromUser = users[0];

    const toSession = new Session();
    toSession.fromUser = users[1];
    toSession.toUser = users[0];

    const room = this.roomRepository.create({
      ...createRoomDto,
      users,
      sessions: [fromSession, toSession],
    });

    return await this.roomRepository.save(room);
  }

  async getMessage(id: number, paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery || {};
    const messageData = await this.dataSource
      .getRepository(Message)
      .createQueryBuilder('message')
      .where({ roomId: id })
      .skip(page ? (page - 1) * limit : undefined)
      .take(limit)
      .getManyAndCount();

    return { data: messageData[0], limit, page, total: messageData[1] };
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    const score = this.sentimentService.analyze(createMessageDto.message);
    const message = this.messageRepository.create({
      ...createMessageDto,
      sentiment_score: score,
    });
    return await this.messageRepository.save(message);
  }
}
