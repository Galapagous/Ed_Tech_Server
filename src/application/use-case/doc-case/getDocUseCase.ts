import { DocDTO } from "@/application/dto/DocDTO";
import { DocRepository } from "@/domain/repositories/DocRepository";

export class GetDocByIdUseCase {
  constructor(private docrepository: DocRepository) {}
  async execute(id: string): Promise<DocDTO> {
    return (await this.docrepository.findById(id)) as unknown as DocDTO;
  }
}
