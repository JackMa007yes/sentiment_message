import { IsString, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  readonly roomId: number;

  @IsInt()
  readonly userId: number;

  @IsString()
  readonly message: string;

  @IsInt()
  sentiment_score: number;
}
