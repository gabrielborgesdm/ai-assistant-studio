// repositories/AssistantRepository.ts
import { AppDataSource } from "@main/features/database/db.config";
import { Assistant } from "@main/features/assistants/model/assistant.model";

export class AssistantRepository {
  private repo = AppDataSource.getRepository(Assistant);

  async getAssistant(id: string): Promise<Assistant | null> {
    return this.repo.findOne({ where: { id } });
  }

  async getAllAssistants(): Promise<Assistant[]> {
    return this.repo.find();
  }

  async createAssistant(data: Partial<Assistant>): Promise<Assistant> {
    const assistant = this.repo.create(data);
    return this.repo.save(assistant);
  }

  async updateAssistant(
    id: string,
    data: Partial<Assistant>,
  ): Promise<Assistant | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    this.repo.merge(existing, data);
    return this.repo.save(existing);
  }

  async deleteAssistant(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
