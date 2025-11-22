// application/use-case/doc-case/createDocUseCase.ts
import { DocRepository } from "@/domain/repositories/DocRepository";
import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { Doc } from "@/domain/entities/doc";
import { ICloudStorage } from "@/domain/entities/cloudinary";

export class CreateDocUseCase {
  constructor(
    private docRepository: DocRepository,
    private idGenerator: IdGenerator,
    private cloudStorage: ICloudStorage
  ) {}

  async execute(file: Express.Multer.File, courseId: string): Promise<Doc> {
    const id = this.idGenerator.generate();

    const uploadResult = await this.cloudStorage.upload(file);
    const doc = Doc.create(uploadResult.secure_url, courseId, id);

    return await this.docRepository.save(doc);
  }
}
