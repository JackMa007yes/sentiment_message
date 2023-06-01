import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly desc: string;

  @IsOptional()
  @IsInt()
  readonly gender: number;

  @IsOptional()
  @IsInt()
  readonly memoji: number;
}
