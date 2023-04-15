import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    return this.usersRepository.find({
      select: ['id', 'name'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.find({
      where: { id: +id },
      select: ['id', 'name'],
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

  async _findOneByName(name: string) {
    const user = await this.usersRepository.find({
      where: { name: name },
      select: ['id', 'name'],
    });
    return user[0];
  }

  findByName(name: string, paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.usersRepository.find({
      where: { name: Like(`%${name}%`) },
      select: ['id', 'name'],
      skip: offset,
      take: limit,
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    const existUser = await this._findOneByName(user.name);
    if (existUser) {
      throw new HttpException(
        `user ${user.name} has been created`,
        HttpStatus.CONFLICT,
      );
    }
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    const nameExist = await this._findOneByName(user.name);
    if (nameExist) {
      throw new HttpException(
        `name ${user.name} has been used`,
        HttpStatus.CONFLICT,
      );
    } else {
      const existUser = await this.usersRepository.preload({
        id,
        ...user,
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
}
