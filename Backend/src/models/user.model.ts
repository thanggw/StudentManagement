import {Entity, property, model, hasOne} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {UserCredentials} from './user-credentials.model';
@model({
  name: 'users',
})
export class User extends BaseEntity {
  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: ['user'],
  })
  roles: string[];

  @hasOne(() => UserCredentials)
  userCredentials?: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export type UserWithRelations = User;
