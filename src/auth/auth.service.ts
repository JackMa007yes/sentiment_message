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

  async login(user) {
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
      return null;
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByName(username, true);
    if (user && user.password === pass) {
      const { password, ...res } = user;
      return res;
    }
    return null;
  }

  async getProfile(id?: number) {
    if (!id) throw new UnauthorizedException();
    return await this.userService.findOne(id);
  }
}
