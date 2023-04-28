import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  ManyToMany,
  OneToMany,
} from 'typeorm';

export enum RoomType {
  PERSONAL,
  GROUP,
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PERSONAL,
  })
  type: RoomType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Session, (session) => session.room, {
    cascade: true,
  })
  sessions: Session[];

  @ManyToMany((type) => User, (user) => user.rooms)
  users: User[];
}
