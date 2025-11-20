import { createDoc, DocDTO } from "@/application/dto/DocDTO";
import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { Doc } from "@/domain/entities/doc";
import { DocRepository } from "@/domain/repositories/DocRepository";

export class CreateDocUseCase {
  constructor(
    private docRepository: DocRepository,
    private idGenerator: IdGenerator
  ) {}

  async execute(dto: createDoc): Promise<DocDTO> {
    const id = this.idGenerator.generate();
    const doc = Doc.create(dto.url, dto.courseId, id);
    const savedDoc = await this.docRepository.save(doc);
    return savedDoc;
  }
}
