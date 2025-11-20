import { CourseRepository } from "@/domain/repositories/CourseRepository";

export class DeleteCourseUseCase {
  constructor(private courseRepository: CourseRepository) {}
  async execute(id: string): Promise<boolean> {
    return await this.courseRepository.delete(id);
  }
}
