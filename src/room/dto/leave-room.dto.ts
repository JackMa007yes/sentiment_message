import { IsInt } from 'class-validator';

export class LeaveRoomDto {
  @IsInt()
  readonly roomId: number;
}
