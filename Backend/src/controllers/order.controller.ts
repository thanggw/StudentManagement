import {repository} from '@loopback/repository';
import {createCrudController} from './base.controller';
import {Order} from '../models/order.model';
import {OrderRepository} from '../repositories/order.repository';
import {get, param} from '@loopback/rest';
import {OrderWithRelations} from '../models/order.model';
const BaseCourseController = createCrudController<Order, OrderRepository>(
  Order,
  '/orders',
);

export class OrderController extends BaseCourseController {
  constructor(
    @repository(OrderRepository)
    repo: OrderRepository,
  ) {
    super(repo);
  }
}
