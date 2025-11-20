import { CourseResponseDTO } from "@/application/dto/CourseDTOs";
import { Course } from "@/domain/entities/course";
import { CourseRepository } from "@/domain/repositories/CourseRepository";

export class GetCourse {
  constructor(private courseRepository: CourseRepository) {}

  async execute(dto: string): Promise<CourseResponseDTO> {
    const course = this.courseRepository.findById(dto);
    return course as unknown as Course;
  }
}
