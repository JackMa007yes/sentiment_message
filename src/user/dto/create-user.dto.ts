import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;

  @IsInt()
  @IsOptional()
  readonly gender?: number;
}
