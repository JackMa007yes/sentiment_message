import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './service/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserListDto } from './dto/get-user-list.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('my')
  async getProfile(@Request() req: any) {
    const id = req.user.sub;
    return this.userService.findOne(id);
  }

  @Get()
  async getUserList(@Query() getUserListDto: GetUserListDto) {
    const list = await this.userService.findByLikeName(getUserListDto);
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

  @Patch()
  async updateUser(@Body() updateUser: UpdateUserDto, @Request() request: any) {
    return this.userService.update(request.user.sub, updateUser);
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() request: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000 * 500 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(request.user.sub, file);
  }
}
