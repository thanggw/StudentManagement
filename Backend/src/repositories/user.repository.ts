import {inject, Getter} from '@loopback/core';
import {HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User} from '../models/user.model';
import {UserCredentials} from '../models/user-credentials.model';
import {UserWithRelations} from '../models/user.model';
import {BaseRepository} from './base.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends BaseRepository<
  User,
  typeof User.prototype.id,
  UserWithRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }
}
