import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Query() paginationQuery: PaginationQueryDto) {
    const list = await this.userService.findAll(paginationQuery);
    return list;
  }

  @Get(':userName')
  async getUserList(
    @Param('userName') userName: string,
    paginationQuery: PaginationQueryDto,
  ) {
    const list = await this.userService.findByName(userName, paginationQuery);
    return list;
  }

  @Delete(':userId')
  async delete(@Param('userId') id: number) {
    return this.userService.remove(id);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  async register(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUser);
  }
}
