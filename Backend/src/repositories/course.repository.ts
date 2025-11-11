import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {Course, CourseRelations} from '../models/course.model';
import {BaseRepository} from './base.repository';

export class CourseRepository extends BaseRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: juggler.DataSource) {
    super(Course, dataSource);
  }
}
