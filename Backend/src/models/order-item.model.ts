import {model, property, belongsTo, Entity} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {Course, CourseWithRelations} from './course.model';
import {Order, OrderWithRelations} from './order.model';

@model()
export class OrderItem extends BaseEntity {
  @property({
    type: 'string',
    required: true,
  })
  orderId?: string;

  @property({
    type: 'string',
    required: true,
  })
  courseId?: string;

  @property({
    type: 'number',
    required: true,
    mongodb: {dataType: 'Number'},
  })
  priceAtPurchase?: number;

  @belongsTo(() => Order, {keyFrom: 'orderId', name: 'order'}, {type: 'string'})
  order?: Order;

  @belongsTo(
    () => Course,
    {keyFrom: 'courseId', name: 'course'},
    {type: 'string'},
  )
  course?: Course;

  constructor(data?: Partial<OrderItem>) {
    super(data);
  }
}

export interface OrderItemRelations {
  order?: OrderWithRelations;
  course?: CourseWithRelations;
}

export type OrderItemWithRelations = OrderItem & OrderItemRelations;
