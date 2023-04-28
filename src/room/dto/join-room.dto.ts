import { IsInt } from 'class-validator';

export class JoinRoomDto {
  @IsInt()
  readonly userId: number;

  @IsInt()
  readonly roomId: number;
}
