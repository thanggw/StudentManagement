import {Entity, property} from '@loopback/repository';

export abstract class BaseEntity extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  constructor(data?: Partial<BaseEntity>) {
    super(data);
  }
}
