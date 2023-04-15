import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  ManyToMany,
} from 'typeorm';

export enum RoomType {
  PERSONAL,
  GROUP,
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: '',
  })
  name: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PERSONAL,
  })
  type: RoomType;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany((type) => User, (user) => user.rooms)
  users: User[];
}
