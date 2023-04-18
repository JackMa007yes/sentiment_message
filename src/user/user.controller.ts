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
  Request,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/punlic.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Query() paginationQuery?: PaginationQueryDto) {
    const list = await this.userService.findAll(paginationQuery);
    return list;
  }

  @Get('my')
  async getProfile(@Request() req: any) {
    const id = req.user.sub;
    return this.userService.findOne(id);
  }

  @Get(':userName')
  async getUserList(
    @Param('userName') userName: string,
    paginationQuery?: PaginationQueryDto,
  ) {
    const list = await this.userService.findByLikeName(
      userName,
      paginationQuery,
    );
    return list;
  }

  @Delete(':userId')
  async delete(@Param('userId') id: number) {
    return this.userService.remove(id);
  }

  @Public()
  @Post()
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
