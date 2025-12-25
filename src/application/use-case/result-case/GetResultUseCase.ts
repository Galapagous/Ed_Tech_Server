import { ResultRepository } from "@/domain/repositories/ResultRepository";

export class GetResultUseCase {
  constructor(private resultRepository: ResultRepository) {}

  async execute(dto: string): Promise<any[]> {
    const results = this.resultRepository.findByCourseId(dto);
    return results;
  }
}
