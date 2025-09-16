import { AppDataSource } from "@main/features/database/db.config";
import { Message } from "@main/features/messages/model/messages.model";

export class MessagesRepository {
  private repo = AppDataSource.getRepository(Message);

  async getMessage(id: string): Promise<Message | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["conversation"], // include parent history
    });
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return this.repo.find({
      where: { conversation: { id: conversationId } },
      relations: ["conversation"],
      order: { createdAt: "ASC" }, // oldest → newest
    });
  }

  async createMessage(data: Partial<Message>): Promise<Message> {
    const message = this.repo.create(data);
    return this.repo.save(message);
  }

  async updateMessage(
    id: string,
    data: Partial<Message>,
  ): Promise<Message | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    this.repo.merge(existing, data);
    return this.repo.save(existing);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
