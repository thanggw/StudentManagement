import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {BaseRepository} from './base.repository';
import {OrderItem, OrderItemRelations} from '../models/order-item.model';
import {Getter} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {OrderRepository} from './order.repository';
import {CourseRepository} from './course.repository';
import {Order} from '../models/order.model';
import {Course} from '../models/course.model';
export class OrderItemRepository extends BaseRepository<
  OrderItem,
  typeof OrderItem.prototype.id,
  OrderItemRelations
> {
  public readonly order: BelongsToAccessor<
    Order,
    typeof OrderItem.prototype.id
  >;

  public readonly course: BelongsToAccessor<
    Course,
    typeof OrderItem.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: juggler.DataSource,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
    @repository.getter('CourseRepository')
    protected courseRepositoryGetter: Getter<CourseRepository>,
  ) {
    super(OrderItem, dataSource);

    this.order = this.createBelongsToAccessorFor(
      'order',
      orderRepositoryGetter,
    );
    this.course = this.createBelongsToAccessorFor(
      'course',
      courseRepositoryGetter,
    );

    this.registerInclusionResolver('order', this.order.inclusionResolver);
    this.registerInclusionResolver('course', this.course.inclusionResolver);
  }
}
