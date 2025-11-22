import {model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {OrderItem} from './order-item.model';

@model()
export class Order extends BaseEntity {
  @property({type: 'string', required: true})
  studentId?: string;

  @property({type: 'number', required: true})
  totalAmount?: number;

  @property({type: 'string', default: 'completed'})
  status?: 'pending' | 'completed' | 'failed';

  @hasMany(() => OrderItem, {keyTo: 'orderId'})
  items?: OrderItem[];
}

export interface OrderRelations {
  items?: OrderItem[];
}

export type OrderWithRelations = Order & OrderRelations;
