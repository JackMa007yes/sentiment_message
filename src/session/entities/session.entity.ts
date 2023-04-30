import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.sessions)
  room: Room;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'from_user' })
  fromUser: User;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'to_user' })
  toUser: User;

  @Column({ name: 'last_message', default: '' })
  lastMessage: string;

  @Column({ name: 'unread_count', default: 0 })
  unreadCount: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: string;

  @UpdateDateColumn({ name: 'last_message_time' })
  lastMessageTime: string;
}
