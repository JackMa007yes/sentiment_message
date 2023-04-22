import { IsInt, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly desc: string;

  @IsInt()
  readonly gender: number;
}
