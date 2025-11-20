import { DocDTO } from "@/application/dto/DocDTO";
import { DocRepository } from "@/domain/repositories/DocRepository";

export class GetDocByCourse {
  constructor(private docRepository: DocRepository) {}
  async execute(courseId: string): Promise<DocDTO[]> {
    const docs = await this.docRepository.findByCourseId(courseId);
    return docs as unknown as DocDTO[];
  }
}
