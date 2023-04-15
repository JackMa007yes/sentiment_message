import { IsString, IsOptional, IsInt } from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly type: RoomType;

  @IsInt({ each: true })
  readonly users: number[];
}
