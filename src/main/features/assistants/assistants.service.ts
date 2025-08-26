import {
  Assistant,
  AssistantFormData,
  AssistantHistory,
  AssistantMessage,
} from "@global/types/assistant";
import { DBType } from "@main/features/database/db.type";
import {
  AssistantDataFactory,
  HistoryFactory,
} from "@global/factories/assistant.factory";

export default class AssistantService {
  db: DBType;

  constructor(db: DBType) {
    this.db = db;
  }

  /*
   * Retrieves all assistants from the database.
   * @param db - The database instance.
   * @returns An array of assistants.
   */
  getAssistants = async (): Promise<Assistant[]> => {
    await this.db.read();
    return this.db.data?.assistants || [];
  };

  saveAssistant = async (
    assistantData: AssistantFormData,
    assistantId: string | undefined,
  ): Promise<Assistant> => {
    await this.db.read();

    // This is to ensure that base models are saved with the latest tag
    // In the near future I'll probably implment a proper versioning system
    let model = assistantData.model;
    if (!model.includes(":")) {
      model = `${model}:latest`;
    }

    const assistant = AssistantDataFactory(
      { ...assistantData, model },
      assistantId,
    );
    const isNewAssistant = !assistant.id;
    if (isNewAssistant) {
      assistant.id = crypto.randomUUID();
      this.db.data.assistants.push(assistant as Assistant);
    } else {
      const foundAssistantIndex = this.db.data?.assistants.findIndex(
        (a) => a.id === assistant.id,
      );

      // If the assistant is not found, throw an error
      // This should never happen
      if (foundAssistantIndex === -1) {
        throw new Error("Assistant not found");
      }

      this.db.data.assistants[foundAssistantIndex] = assistant as Assistant;
    }

    await this.db.write();

    return assistant as Assistant;
  };

  /*
   * Retrieves a specific assistant from the database by its ID.
   * @param db - The database instance.
   * @param assistantId - The ID of the assistant to retrieve.
   * @returns The assistant object if found, otherwise undefined.
   */
  getHistory = async (
    assistantId: string,
  ): Promise<AssistantHistory | undefined> => {
    const histories: AssistantHistory[] = this.db.data?.history;

    return histories.find((history) => history.assistantId === assistantId);
  };

  /*
   * Adds a message to the assistant history.
   * If the assistant history does not exist, it creates a new one.
   * @param db - The database instance.
   * @param assistantId - The ID of the assistant.
   * @param message - The message to add.
   * @returns The updated assistant history.
   */
  addAssistantMessage = async (
    assistantId: string,
    messages: AssistantMessage[],
  ): Promise<AssistantHistory> => {
    await this.db.read();
    const histories: AssistantHistory[] = this.db.data?.history;
    let filteredHistory = await this.getHistory(assistantId);

    if (!filteredHistory) {
      filteredHistory = HistoryFactory(assistantId, [...messages]);
    } else {
      filteredHistory.messages = [...filteredHistory.messages, ...messages];
    }

    histories.push(filteredHistory);
    // Push without needing to wait
    this.db.write();

    return filteredHistory;
  };

  clearHistory = async (assistantId: string): Promise<void> => {
    console.log("Clearing history for assistantId:", assistantId);

    await this.db.read();
    if (!this.db.data.history?.length) {
      console.log("No histories found");
      return;
    }
    this.db.data.history = this.db.data?.history.filter(
      (history) => history.assistantId !== assistantId,
    );
    console.log("Cleaning history", assistantId);
    this.db.write();
  };

  deleteAssistant = async (assistantId: string): Promise<void> => {
    await this.db.read();
    this.db.data.assistants = this.db.data?.assistants.filter(
      (assistant) => assistant.id !== assistantId,
    );
    await this.db.write();
  };
}
