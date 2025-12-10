import { Course } from "../entities/course";

export interface CourseRepository {
  save(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findByOwner(id: string): Promise<Course[] | null>;
  findAll(limit?: number, offset?: number): Promise<Course[]>;
  delete(id: string): Promise<boolean>;
}
