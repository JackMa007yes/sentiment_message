import { IsString, IsInt } from 'class-validator';
import { Message } from 'src/room/entities/message.entity';

export class UpdateSessionDto {
  @IsInt()
  readonly id: number;

  @IsString()
  readonly lastMessage: Message;
}
