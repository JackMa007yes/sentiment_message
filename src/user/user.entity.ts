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

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: GenderType,
    default: GenderType.MALE,
  })
  gender: GenderType;

  @Column({ default: '' })
  desc: string;

  @Column({ type: 'bytea', default: '' })
  avatar: Buffer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @JoinTable()
  @ManyToMany((type) => Room, (room) => room.users, {
    cascade: true,
  })
  rooms: Room[];
}
