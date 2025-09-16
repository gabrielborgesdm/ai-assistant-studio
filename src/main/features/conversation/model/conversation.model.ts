// src/entities/Conversation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Message } from "@main/features/messages/model/messages.model";
import { Assistant } from "@main/features/assistants/model/assistant.model";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text", { nullable: true })
  description!: string;

  @ManyToOne(() => Assistant, { onDelete: "CASCADE" })
  assistant!: Assistant;

  @OneToMany(() => Message, (message) => message.conversation, { cascade: true })
  messages!: Message[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
