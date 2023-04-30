import { UpdateSessionDto } from './dto/update-session.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  findAll() {
    return this.sessionRepository.find();
  }

  async findByUserId(userId: number) {
    return this.sessionRepository.find({
      relations: { fromUser: true, toUser: true },
      where: {
        fromUser: {
          id: userId,
        },
      },
    });
  }

  async update(updateSessionDto: UpdateSessionDto, Increase = true) {
    const { id, lastMessage } = updateSessionDto;
    const existSession = await this.sessionRepository.findOneBy({ id });
    if (!existSession) {
      throw new HttpException(`session not found`, HttpStatus.CONFLICT);
    }
    const updatedSession = await this.sessionRepository.preload({
      ...existSession,
      lastMessage,
      unreadCount: Increase ? existSession.unreadCount++ : 0,
    });
    return this.sessionRepository.save(updatedSession);
  }

  async updateInSession(updateSessionDto: UpdateSessionDto) {
    this.update(updateSessionDto, false);
  }

  async check(sessionId: number) {
    const existSession = await this.sessionRepository.findOneBy({
      id: sessionId,
    });
    if (!existSession) {
      throw new HttpException(`session not found`, HttpStatus.CONFLICT);
    }
    const updatedSession = await this.sessionRepository.preload({
      ...existSession,
      unreadCount: 0,
    });
    return this.sessionRepository.save(updatedSession);
  }

  async remove(sessionId: number) {
    const existSession = await this.sessionRepository.findOneBy({
      id: sessionId,
    });
    if (!existSession) {
      throw new HttpException(`session not found`, HttpStatus.CONFLICT);
    }
    return this.sessionRepository.remove(existSession);
  }
}
