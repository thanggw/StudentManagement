import {repository} from '@loopback/repository';
import {createCrudController} from './base.controller';
import {Course} from '../models/course.model';
import {CourseRepository} from '../repositories/course.repository';

const BaseCourseController = createCrudController<Course, CourseRepository>(
  Course,
  '/courses',
);

export class CourseController extends BaseCourseController {
  constructor(
    @repository(CourseRepository)
    repo: CourseRepository,
  ) {
    super(repo);
  }
}
