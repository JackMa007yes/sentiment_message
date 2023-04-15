import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { Message } from '../entities/message.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Room } from '../entities/room.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly userService: UserService,
    private readonly datasource: DataSource,
    @InjectRepository(Room)
    private readonly RoomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.RoomRepository.find({
      skip: offset,
      take: limit,
      relations: ['users'],
    });
  }

  async findOne(id: number) {
    const room = await this.RoomRepository.findOne({
      where: {
        id,
      },
    });
    if (!room) {
      throw new NotFoundException('not found');
    }
    return room;
  }

  async findByUserId(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
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

  async create(createRoom: CreateRoomDto) {
    const users = await this.userService.findByIdList(createRoom.users);
    const rooms = await this.RoomRepository.find({
      relations: { users: true },
    });
    const existRoom = rooms.some((room) => {
      if (room.users.length !== createRoom.users.length) return false;
      return room.users.every((user) => createRoom.users.includes(user.id));
    });
    if (existRoom) {
      throw new HttpException(`room has been created`, HttpStatus.CONFLICT);
    }

    const room = this.RoomRepository.create({ ...createRoom, users });
    const savedRoom = await this.RoomRepository.save(room);
    return savedRoom.id;
  }

  async getMessage(id: number, paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.messageRepository.find({
      where: {
        roomId: id,
      },
      order: {
        id: 'DESC',
      },
      skip: offset,
      take: limit,
    });
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return await this.messageRepository.save(message);
  }
}
