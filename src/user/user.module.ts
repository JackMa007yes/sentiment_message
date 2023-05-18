import { ImageService } from './service/image.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './service/user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OSSService } from 'src/common/services/OSS.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, ImageService, OSSService],
  exports: [UserService],
})
export class UserModule {}
