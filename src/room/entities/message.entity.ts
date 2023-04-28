import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  userId: number;

  @Column()
  message: string;

  @Column()
  sentiment_score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
