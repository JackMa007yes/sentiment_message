import { IsString, IsOptional, IsInt } from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsOptional()
  @IsInt()
  readonly type: RoomType;

  @IsInt({ each: true })
  readonly users: number[];
}
