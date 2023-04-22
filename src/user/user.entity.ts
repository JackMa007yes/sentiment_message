import { Room } from 'src/room/entities/room.entity';
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @JoinTable()
  @ManyToMany((type) => Room, (room) => room.users, {
    cascade: true, // 可以这样设置 ['insert'] 代表仅仅插入时进行级联操作
  })
  rooms: Room[];
}
