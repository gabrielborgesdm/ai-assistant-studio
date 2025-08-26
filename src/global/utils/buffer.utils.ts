/* eslint-disable @typescript-eslint/no-explicit-any */
export const processStreamBufferToJson = async (
  buffer: Buffer,
): Promise<Record<string, any> | null> => {
  try {
    const text = buffer.toString();
    if (!text) {
      console.warn("Empty response chunk received");
      return null;
    }

    // Handle multiple JSON objects in a single chunk
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    // Return the last valid JSON object in the chunk
    // This is a workaround for the fact that ollama returns multiple JSON objects in a single chunk when it's finished streaming
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        return JSON.parse(lines[i]);
      } catch {
        // Try next line if parsing fails
        continue;
      }
    }

    console.log("No valid JSON object found in chunk");
    return null;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error processing chunk:", errorMessage);
    console.error("Chunk content:", buffer.toString("utf-8"));
    return null;
  }
};
