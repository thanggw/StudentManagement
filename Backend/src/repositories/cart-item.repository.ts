import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CartItem, CartItemRelations} from '../models/cart-item.model';
import {MongodbDataSource} from '../datasources';
import {BaseRepository} from './base.repository';
import {Course} from '../models/course.model';
import {BelongsToAccessor} from '@loopback/repository';
import {repository} from '@loopback/repository';
import {Getter} from '@loopback/core';
import {CourseRepository} from './course.repository';
export class CartItemRepository extends BaseRepository<
  CartItem,
  typeof CartItem.prototype.id,
  CartItemRelations
> {
  public readonly course: BelongsToAccessor<
    Course,
    typeof CartItem.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,

    @repository.getter('CourseRepository')
    protected courseRepositoryGetter: Getter<CourseRepository>,
  ) {
    super(CartItem, dataSource);

    this.course = this.createBelongsToAccessorFor(
      'course',
      this.courseRepositoryGetter,
    );

    this.registerInclusionResolver('course', this.course.inclusionResolver);
  }
}
