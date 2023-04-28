import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(name, pass) {
    const user = await this.userService.findByName(name);
    if (user?.password !== pass) {
      throw new HttpException(`wrong password`, HttpStatus.FORBIDDEN);
    }
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
