import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { OSSService } from 'src/common/services/OSS.service';
import { ImageService } from './image.service';
import { User } from '../user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserListDto } from '../dto/get-user-list.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private imageService: ImageService,
    private OSSService: OSSService,
  ) {}

  async findAll(paginationQuery?: PaginationQueryDto): Promise<any> {
    const { limit, page } = paginationQuery || {};
    const userData = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.avatar')
      .skip(page ? (page - 1) * limit : undefined)
      .take(limit)
      .getManyAndCount();

    return { data: userData[0], limit, page, total: userData[1] };
  }

  async findOne(id: number) {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.avatar')
      .where({ id: id })
      .getMany();

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

  async findByName(name: string, withPathword = false) {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.avatar')
      .addSelect(withPathword ? 'user.password' : undefined)
      .where({ name: name })
      .getMany();

    return user[0];
  }

  async verifyUser(name: string) {
    return this.findByName(name, true);
  }

  async findByLikeName(getUserListDto: GetUserListDto) {
    const { limit, page, keyword } = getUserListDto;
    const userData = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where(keyword ? { name: Like(`%${keyword}%`) } : {})
      .skip(page ? (page - 1) * limit : undefined)
      .take(limit)
      .addSelect('user.avatar')
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
    const user = await this.findByName(updateUserDto.name);
    const nameExist = user && user.id !== id;
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
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('not found');
      } else if (user.avatar) {
        this.OSSService.deleteObject(user.avatar);
      } else {
        // Noop
      }
      const buffer = await this.imageService.compression(file.buffer);
      const res = await this.OSSService.uploadAvatar(buffer, file.originalname);
      const updatedUser = await this.usersRepository.preload({
        id: userId,
        avatar: res.Location,
      });

      return this.usersRepository.save(updatedUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
