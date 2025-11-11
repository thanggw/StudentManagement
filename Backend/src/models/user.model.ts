import {Entity, property, model} from '@loopback/repository';
import {BaseEntity} from './base.model';

@model({
  name: 'users',
  settings: {
    hiddenProperties: ['password'], // Ẩn password khi trả về response
  },
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
    jsonSchema: {
      minLength: 6,
    },
  })
  password: string;

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

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export type UserWithRelations = User;
