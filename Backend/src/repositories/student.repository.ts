import {inject} from '@loopback/core';
import {Student, StudentRelations} from '../models';
import {MongodbDataSource} from '../datasources';
import {BaseRepository} from './base.repository';

export class StudentRepository extends BaseRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(Student, dataSource);
  }
}
