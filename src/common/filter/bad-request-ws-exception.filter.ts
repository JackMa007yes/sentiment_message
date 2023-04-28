import { ArgumentsHost, Catch, BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(BadRequestException)
export class BadRequestWsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }
}
