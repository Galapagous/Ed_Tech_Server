import { CourseResponseDTO } from "@/application/dto/CourseDTOs";
import { Course } from "@/domain/entities/course";
import { CourseRepository } from "@/domain/repositories/CourseRepository";

export class GetCourseUserCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(dto: string): Promise<CourseResponseDTO[]> {
    const courses = this.courseRepository.findByOwner(dto);
    return courses as unknown as Course[];
  }
}
