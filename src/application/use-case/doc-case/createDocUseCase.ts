import { createDoc, DocDTO } from "@/application/dto/DocDTO";
import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { Doc } from "@/domain/entities/doc";
import { DocRepository } from "@/domain/repositories/DocRepository";
import { CloudinaryService } from "@/infrastructure/storage/cloudinaryStorage";

export class CreateDocUseCase {
  constructor(
    private docRepository: DocRepository,
    private idGenerator: IdGenerator,
    private CloudService: CloudinaryService
  ) {}

  async execute(dto: createDoc): Promise<DocDTO> {
    const id = this.idGenerator.generate();
    const docUrl = await this.CloudService.upload(dto.url);
    const doc = Doc.create(docUrl, dto.courseId, id);
    const savedDoc = await this.docRepository.save(doc);
    return savedDoc;
  }
}
