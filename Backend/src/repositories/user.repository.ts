import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User, UserWithRelations} from '../models/user.model';
import {BaseRepository} from './base.repository';

export class UserRepository extends BaseRepository<
  User,
  typeof User.prototype.id,
  UserWithRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(User, dataSource);
  }
}
