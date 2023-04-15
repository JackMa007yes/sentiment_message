import { CreateRoomDto } from './dto/create-room.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { RoomService } from './service/room.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getALl(@Query() paginationQuery: PaginationQueryDto) {
    return this.roomService.findAll(paginationQuery);
  }

  @Get('/my/:id')
  async getMy(@Param('id') id: number) {
    return this.roomService.findByUserId(id);
  }

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get('message/:id')
  async getMessage(
    @Param('id') id: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.roomService.getMessage(id, paginationQuery);
  }

  @Post('message')
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.roomService.addMessage(createMessageDto);
  }
}
