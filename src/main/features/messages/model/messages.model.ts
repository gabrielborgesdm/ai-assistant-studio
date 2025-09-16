import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Conversation } from "@main/features/conversation/model/conversation.model";

export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  CUSTOM_UI = "custom_ui",
  CUSTOM_ERROR = "custom_error",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 50,
  })
  role!: MessageRole;

  @Column("text")
  content!: string;

  @Column("simple-array", { nullable: true })
  images?: string[];

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversationId" }) // explicit join column helps
  conversation!: Conversation;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
