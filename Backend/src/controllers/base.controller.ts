import {
  Count,
  Filter,
  FilterExcludingWhere,
  Where,
  DefaultCrudRepository,
  Entity,
  DataObject,
} from '@loopback/repository';

export abstract class BaseController<
  T extends Entity,
  R extends DefaultCrudRepository<T, any>,
> {
  protected repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async create(data: DataObject<T>): Promise<T> {
    return this.repository.create(data);
  }

  async count(where?: Where<T>): Promise<Count> {
    return this.repository.count(where);
  }

  async find(filter?: Filter<T>): Promise<T[]> {
    return this.repository.find(filter);
  }

  async findById(id: string, filter?: FilterExcludingWhere<T>): Promise<T> {
    return this.repository.findById(id, filter);
  }

  async updateById(id: string, data: Partial<T>): Promise<void> {
    await this.repository.updateById(id, data);
  }

  async replaceById(id: string, data: T): Promise<void> {
    await this.repository.replaceById(id, data);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }
}
