import {repository} from '@loopback/repository';
import {createCrudController} from './base.controller';
import {Course} from '../models/course.model';
import {CourseRepository} from '../repositories/course.repository';
import {get, param} from '@loopback/rest';
import {CourseWithRelations} from '../models/course.model';
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
