import { DataSource } from "typeorm";
import { vi } from "vitest";
import { Assistant } from "@main/features/assistants/model/assistant.model";
import { Conversation } from "@main/features/conversation/model/conversation.model";
import { Message } from "@main/features/messages/model/messages.model";

/**
 * Test database helper for integration tests
 * Provides utilities for setting up and tearing down test databases
 */
export class TestDatabaseHelper {
  private dataSource: DataSource | null = null;

  /**
   * Initialize test database with in-memory SQLite
   */
  async initialize(logging = false): Promise<DataSource> {
    this.dataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:", // In-memory database for testing
      synchronize: true,
      entities: [Assistant, Conversation, Message],
      logging,
    });

    await this.dataSource.initialize();
    return this.dataSource;
  }

  /**
   * Get the current data source
   */
  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.dataSource;
  }

  /**
   * Clean all data from test database
   */
  async cleanDatabase(): Promise<void> {
    if (!this.dataSource) return;

    // Delete in reverse dependency order to avoid foreign key conflicts
    await this.dataSource.getRepository(Message).clear();
    await this.dataSource.getRepository(Conversation).clear();
    await this.dataSource.getRepository(Assistant).clear();
  }

  /**
   * Destroy the test database connection
   */
  async destroy(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
    this.dataSource = null;
  }

  /**
   * Mock the AppDataSource for repository classes
   * Call this in beforeAll to ensure repositories use the test database
   */
  mockAppDataSource(): void {
    if (!this.dataSource) {
      throw new Error("Database not initialized. Call initialize() first.");
    }

    // Mock the AppDataSource module using vitest
    vi.doMock("@main/features/database/db.config", () => ({
      AppDataSource: this.dataSource
    }));
  }
}

/**
 * Global test database instance
 * Use this for consistency across test files
 */
export const testDb = new TestDatabaseHelper();