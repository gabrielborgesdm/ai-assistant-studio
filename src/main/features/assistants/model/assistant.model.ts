// src/entities/Assistant.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Assistant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  title!: string;

  @Column("text")
  description!: string;

  @Column("text")
  model!: string;

  // Stored as JSON string since GenerateRequest is complex
  @Column("simple-json", { nullable: true })
  options?: any;

  @Column("boolean", { default: false })
  downloaded!: boolean;

  @Column("boolean", { default: false })
  ephemeral!: boolean;

  @Column("text", { nullable: true })
  prompt?: string;

  @Column("text", { nullable: true })
  systemBehaviour?: string;

  @Column("boolean", { default: false })
  allowImage!: boolean;

  @Column("text", { nullable: true })
  contextPath?: string;
}
