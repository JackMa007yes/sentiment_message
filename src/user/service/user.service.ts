import { ImageService } from './image.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private imageService: ImageService,
  ) {}

  async findAll(paginationQuery?: PaginationQueryDto): Promise<any> {
    const { limit, page } = paginationQuery || {};
    const userData = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.name', 'user.id', 'user.desc', 'user.avatar'])
      .skip(page ? (page - 1) * limit : undefined)
      .take(limit)
      .getManyAndCount();

    return { data: userData[0], limit, page, total: userData[1] };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.find({
      where: { id: +id },
      select: ['id', 'name', 'desc', 'avatar'],
    });
    if (!user) {
      throw new NotFoundException(`user ${id} not fount`);
    }
    return user[0];
  }

  async findByIdList(idList: number[]) {
    const userList = await Promise.all(idList.map((id) => this.findOne(id)));
    if (userList.some((user) => !user)) {
      throw new NotFoundException(`user not fount`);
    }
    return userList;
  }

  async findByName(name: string) {
    const user = await this.usersRepository.find({
      where: { name: name },
    });
    return user[0];
  }

  async findByLikeName(name: string, paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;
    const userData = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.name', 'user.id', 'user.desc', 'user.avatar'])
      .where({ name: Like(`%${name}%`) })
      .skip(page ? (page - 1) * limit : undefined)
      .take(limit)
      .getManyAndCount();

    return { data: userData[0], limit, page, total: userData[1] };
  }

  async create(user: CreateUserDto): Promise<User> {
    const existUser = await this.findByName(user.name);
    if (existUser) {
      throw new HttpException(
        `user ${user.name} has been created`,
        HttpStatus.CONFLICT,
      );
    }
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const nameExist = await this.findByName(updateUserDto.name);
    if (nameExist) {
      throw new HttpException(
        `name ${updateUserDto.name} has been used`,
        HttpStatus.CONFLICT,
      );
    } else {
      const existUser = await this.usersRepository.preload({
        id,
        ...updateUserDto,
      });
      if (!existUser) {
        throw new HttpException(
          `No user with id ${id} found`,
          HttpStatus.CONFLICT,
        );
      }
      return this.usersRepository.save(existUser);
    }
  }

  async remove(id: number): Promise<void> {
    const existUser = await this.findOne(id);
    if (!existUser) {
      throw new HttpException(
        `No user with id ${id} found`,
        HttpStatus.CONFLICT,
      );
    }
    await this.usersRepository.remove(existUser);
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const buffer = await this.imageService.compression(file.buffer);
    const user = await this.usersRepository.preload({
      id: userId,
      avatar: buffer,
    });
    if (!user) {
      throw new NotFoundException('not found');
    }
    return this.usersRepository.save(user);
  }
}
