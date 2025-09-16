// src/entities/Config.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id!: number; // ✅ add definite assignment (!) for TS strict mode

  @Column("integer", { default: 1024 })
  windowWidth!: number; // ✅ add !

  @Column("integer", { default: 768 })
  windowHeight!: number; // ✅ add !

  @Column("text")
  shortcut!: string; // ✅ add !

  @Column("boolean", { default: false })
  runAtStartup!: boolean; // ✅ add !

  @Column("boolean", { default: false })
  databaseSeeded!: boolean;
}