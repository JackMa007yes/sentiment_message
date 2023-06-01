import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum MessageType {
  TEXT,
  IMAGE,
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  userId: number;

  @Column({ default: MessageType.TEXT })
  type: MessageType;

  @Column({ name: 'image_url', default: '' })
  imageUrl: string;

  @Column({ default: '' })
  message: string;

  @Column()
  sentimentScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
