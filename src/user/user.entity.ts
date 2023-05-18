import { Room } from 'src/room/entities/room.entity';
import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

export enum GenderType {
  FEMALE,
  MALE,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: GenderType,
    default: GenderType.MALE,
  })
  gender: GenderType;

  @Column({ default: '' })
  desc: string;

  @Column({ default: '', select: false })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @JoinTable()
  @ManyToMany((type) => Room, (room) => room.users, {
    cascade: false,
  })
  rooms: Room[];
}
