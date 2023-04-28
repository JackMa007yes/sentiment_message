import { IsString, ValidateNested } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

export class MessageEventDto {
  @IsString()
  readonly type: string;

  @ValidateNested()
  readonly payload: CreateMessageDto;
}
