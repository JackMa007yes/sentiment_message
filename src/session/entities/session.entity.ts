import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ name: 'from_user_id' })
  fromUserId: number;

  @Column({ name: 'to_user_id' })
  toUserId: number;

  @Column({ name: 'last_message', default: '' })
  lastMessage: string;

  @Column({ name: 'unread_count', default: 0 })
  unreadCount: number;

  @CreateDateColumn({ name: 'create_session_time' })
  createSessionTime: string;

  @UpdateDateColumn({ name: 'last_message_time' })
  lastMessageTime: string;
}
