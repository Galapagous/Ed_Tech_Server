import { CourseResponseDTO } from "@/application/dto/CourseDTOs";
import { Course } from "@/domain/entities/course";
import { CourseRepository } from "@/domain/repositories/CourseRepository";
import { DocRepository } from "@/domain/repositories/DocRepository";

export class GetCourseUserCase {
  constructor(
    private courseRepository: CourseRepository,
    private DocRepository: DocRepository
  ) {}

  async execute(dto: string): Promise<CourseResponseDTO[]> {
    const courses = await this.courseRepository.findByOwner(dto);
    let doc = null;
    if (courses !== null) {
      doc = await Promise.all(
        courses?.map(async (course: any) => {
          return await this.DocRepository.findByCourseId(course.id);
        })
      );
    }
    const result = courses?.map((course, index) => ({
      ...course,
      doc: doc ? doc[index]?.length : 0,
    }));
    return { result } as unknown as Course[];
  }
}
