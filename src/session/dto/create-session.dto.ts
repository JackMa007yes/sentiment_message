import { IsInt } from 'class-validator';

export class CreateSessionDto {
  @IsInt()
  readonly fromUserId: number;

  @IsInt()
  readonly toUserId: number;
}
