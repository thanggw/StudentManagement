import {Getter} from '@loopback/core';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {OrderItem, OrderItemRelations} from '../models/order-item.model';
import {OrderItemRepository} from './order-item.repository';
import {Order} from '../models/order.model';
import {OrderRelations} from '../models/order.model';
import {BaseRepository} from './base.repository';
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
export class OrderRepository extends BaseRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  public readonly items: HasManyRepositoryFactory<
    OrderItem,
    typeof Order.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: juggler.DataSource,
    @repository.getter('OrderItemRepository')
    orderItemRepositoryGetter: Getter<OrderItemRepository>,
  ) {
    super(Order, dataSource);
    this.items = this.createHasManyRepositoryFactoryFor(
      'items',
      orderItemRepositoryGetter,
    );

    this.registerInclusionResolver('items', this.items.inclusionResolver);
  }
}
