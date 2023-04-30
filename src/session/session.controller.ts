import { Controller, Get, Param, Request } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getALl(@Request() req) {
    return this.sessionService.findByUserId(req.user.sub);
  }

  @Get('/:id')
  async getA(@Param('id') id) {
    return this.sessionService.findByUserId(Number(id));
  }
}
