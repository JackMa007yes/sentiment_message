import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
