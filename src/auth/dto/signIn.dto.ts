import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;
}
