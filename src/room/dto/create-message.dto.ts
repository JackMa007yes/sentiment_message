import { IsString, IsInt, IsOptional } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class CreateMessageDto {
  @IsInt()
  readonly roomId: number;

  @IsInt()
  readonly type: MessageType;

  @IsInt()
  readonly userId: number;

  @IsString()
  readonly message: string;

  @IsOptional()
  @IsString()
  readonly imageUrl: string;
}
