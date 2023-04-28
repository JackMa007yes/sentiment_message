import { IsString, IsInt } from 'class-validator';

export class UpdateSessionDto {
  @IsInt()
  readonly id: number;

  @IsString()
  readonly lastMessage: string;
}
