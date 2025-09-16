import { afterAll, beforeAll, beforeEach } from "vitest";
import { testDb } from "../helpers/database.helper";
import { TestFixturesHelper } from "../helpers/fixtures.helper";

/**
 * Common integration test setup utilities
 * Provides standardized setup/teardown patterns for integration tests
 */
export class IntegrationTestSetup {
  private fixtures: TestFixturesHelper | null = null;

  /**
   * Initialize test environment
   * Call this in beforeAll
   */
  async setupTest(options: { logging?: boolean } = {}): Promise<void> {
    const dataSource = await testDb.initialize(options.logging);
    testDb.mockAppDataSource();
    this.fixtures = new TestFixturesHelper(dataSource);
  }

  /**
   * Clean test data between tests
   * Call this in beforeEach
   */
  async cleanData(): Promise<void> {
    await testDb.cleanDatabase();
  }

  /**
   * Tear down test environment
   * Call this in afterAll
   */
  async teardownTest(): Promise<void> {
    await testDb.destroy();
    this.fixtures = null;
  }

  /**
   * Get fixtures helper for creating test data
   */
  getFixtures(): TestFixturesHelper {
    if (!this.fixtures) {
      throw new Error("Test not initialized. Call setupTest() first.");
    }
    return this.fixtures;
  }

  /**
   * Get the test database instance
   */
  getDataSource() {
    return testDb.getDataSource();
  }
}

/**
 * Global integration test setup instance
 * Use this for consistency across integration test files
 */
export const integrationSetup = new IntegrationTestSetup();

/**
 * Convenience function to set up common integration test patterns
 * Use this to reduce boilerplate in test files
 */
export function setupIntegrationTest(options: { logging?: boolean } = {}): IntegrationTestSetup {
  beforeAll(async () => {
    await integrationSetup.setupTest(options);
  });

  beforeEach(async () => {
    await integrationSetup.cleanData();
  });

  afterAll(async () => {
    await integrationSetup.teardownTest();
  });

  return integrationSetup;
}