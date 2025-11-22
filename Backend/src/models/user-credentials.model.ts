import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'user_credentials',
})
export class UserCredentials extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  usersId?: string;

  @property({
    type: 'string',
    required: true,
  })
  password?: string;
}
