import { UserService } from 'src/user/service/user.service';
import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { AuthService } from 'src/auth/auth.service';

export class AuthIoAdapter extends IoAdapter {
  private readonly authService: AuthService;
  private readonly userService: UserService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.authService = this.app.get(AuthService);
    this.userService = this.app.get(UserService);
  }

  createIOServer(port: number, options?: any): any {
    options.allowRequest = async (request, allowFunction) => {
      const token = request._query?.token;

      const isVerified =
        token && (await this.authService.verifyAccessToken(token));

      if (isVerified) {
        return allowFunction(null, true);
      }

      return allowFunction('Unauthorized', false);
    };

    return super.createIOServer(port, options);
  }
}
