import {
  DefaultCrudRepository,
  Entity,
  juggler,
  Where,
  Filter,
  DataObject,
  Count,
} from '@loopback/repository';
import {inject} from '@loopback/core';
import {InclusionResolver} from '@loopback/repository';
export abstract class BaseRepository<
  T extends Entity,
  ID,
  Relations extends object = {},
> extends DefaultCrudRepository<T, ID, Relations> {
  constructor(
    entityClass: typeof Entity & {prototype: T},
    @inject('datasources.mongodb') dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
  }

  async create(data: DataObject<T>, options?: object): Promise<T> {
    (data as any).createdAt = new Date();
    (data as any).updatedAt = new Date();
    return super.create(data, options);
  }

  async updateById(
    id: ID,
    data: DataObject<T>,
    options?: object,
  ): Promise<void> {
    (data as any).updatedAt = new Date();
    return super.updateById(id, data, options);
  }

  /**
   * Soft delete
   */
  async softDeleteById(id: ID): Promise<void> {
    await this.updateById(id, {deleted: true} as any);
  }

  /**
   * Find with pagination
   */
  async findWithPagination(
    filter?: Filter<T>,
    page = 1,
    limit = 10,
  ): Promise<{data: T[]; total: number; page: number; limit: number}> {
    const skip = (page - 1) * limit;
    const [data, countResult] = await Promise.all([
      this.find({...filter, limit, skip}),
      this.count(filter?.where as Where<T>),
    ]);
    return {data, total: countResult.count, page, limit};
  }
  createInclusionResolver(
    relationName: string,
    targetRepo: any,
  ): InclusionResolver<T, Entity> {
    const resolver = this[relationName as keyof this];
    if (typeof (resolver as any)?.inclusionResolver === 'function') {
      return (resolver as any).inclusionResolver;
    }
    throw new Error(`No inclusion resolver found for relation ${relationName}`);
  }
}
