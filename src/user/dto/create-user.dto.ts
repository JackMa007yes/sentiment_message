import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @IsOptional()
  readonly id?: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;
}
