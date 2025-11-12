import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserCredentials} from '../models/user-credentials.model';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.usersId
> {
  constructor(@inject('datasources.mongodb') dataSource: juggler.DataSource) {
    super(UserCredentials, dataSource);
  }
}
