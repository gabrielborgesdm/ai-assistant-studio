import { RagService } from "./rag.service";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("RagService", () => {
  const tempDir = path.join(__dirname, "temp-test-docs");

  // --- Define your document content here ---
  const doc1Content = `
    The quick brown fox jumps over the lazy dog.
    This sentence is for testing retrieval.
    Gemini is a large language model.
  `;
  const doc2Content = `
    Software engineering involves building and maintaining systems.
    Testing is a crucial part of the development lifecycle.
    AI assistants can help streamline workflows.
  `;
  const doc3Content = `
    The capital of France is Paris.
    The sky is blue on a clear day.
    Water boils at 100 degrees Celsius.
  `;
  // -----------------------------------------

  beforeAll(() => {
    // Create a temporary directory for our test files
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Create sample files with the content defined above
    fs.writeFileSync(path.join(tempDir, "doc1.txt"), doc1Content);
    fs.writeFileSync(path.join(tempDir, "doc2.md"), doc2Content);
    fs.writeFileSync(path.join(tempDir, "doc3.txt"), doc3Content);
  });

  afterAll(() => {
    // Clean up the temporary directory and files
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should retrieve context based on a query", async () => {
    const ragService = new RagService();
    const query = "What is software engineering?";

    console.log(`\nExecuting RAG test with query: "${query}"`);
    console.log("---");

    const context = await ragService.getContext(tempDir, query);

    console.log("\n--- Retrieved Context ---");
    console.log(context);
    console.log("-------------------------\n");

    // Basic assertion to ensure the function runs and returns a string
    expect(typeof context).toBe("string");
    // You can add more specific assertions here based on expected content
    expect(context).toContain("Software engineering");
  }, 30000); // Increase timeout for model loading and processing

  // The idea is to test if the contextual search is working
  it("should retrieve context based on a non direct query", async () => {
    const ragService = new RagService();
    const query = "What city is mentioned?";

    console.log(`\nExecuting RAG test with query: "${query}"`);
    console.log("---");

    const context = await ragService.getContext(tempDir, query);

    console.log("\n--- Retrieved Context ---");
    console.log(context);
    console.log("-------------------------\n");

    const firstParagraph = context.split("\n\n")[0];
    console.log("First paragraph:", firstParagraph);

    // Basic assertion to ensure the function runs and returns a string
    expect(typeof context).toBe("string");
    // You can add more specific assertions here based on expected content
    expect(firstParagraph).toContain("Paris");
  }, 30000); // Increase timeout for model loading and processing
});
