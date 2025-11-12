import {
  get,
  post,
  patch,
  put,
  del,
  param,
  requestBody,
  response,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Count,
  CountSchema,
  DataObject,
  DefaultCrudRepository,
  Entity,
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';

export function createCrudController<
  T extends Entity,
  R extends DefaultCrudRepository<T, any>,
>(modelCtor: typeof Entity, basePath: string) {
  class CrudController {
    constructor(public repository: R) {}

    @post(basePath)
    @response(200, {
      description: `${modelCtor.name} model instance`,
      content: {'application/json': {schema: getModelSchemaRef(modelCtor)}},
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(modelCtor as any, {exclude: ['id']}),
          },
        },
      })
      data: Omit<T, 'id'>,
    ): Promise<T> {
      return this.repository.create(data as DataObject<T>);
    }

    @get(`${basePath}/count`)
    @response(200, {
      description: `${modelCtor.name} count`,
      content: {'application/json': {schema: CountSchema}},
    })
    async count(@param.where(modelCtor) where?: Where<T>): Promise<Count> {
      return this.repository.count(where);
    }

    @get(basePath)
    @response(200, {
      description: `Array of ${modelCtor.name} instances`,
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(modelCtor, {includeRelations: true}),
          },
        },
      },
    })
    async find(@param.filter(modelCtor) filter?: Filter<T>): Promise<T[]> {
      return this.repository.find(filter);
    }

    @get(`${basePath}/{id}`)
    @response(200, {
      description: `${modelCtor.name} instance`,
      content: {
        'application/json': {
          schema: getModelSchemaRef(modelCtor, {includeRelations: true}),
        },
      },
    })
    async findById(
      @param.path.string('id') id: string,
      @param.filter(modelCtor, {exclude: 'where'})
      filter?: FilterExcludingWhere<T>,
    ): Promise<T> {
      return this.repository.findById(id, filter);
    }

    @patch(`${basePath}/{id}`)
    @response(204, {description: `${modelCtor.name} PATCH success`})
    async updateById(
      @param.path.string('id') id: string,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(modelCtor, {partial: true}),
          },
        },
      })
      data: Partial<T>,
    ): Promise<void> {
      await this.repository.updateById(id, data);
    }

    @put(`${basePath}/{id}`)
    @response(204, {description: `${modelCtor.name} PUT success`})
    async replaceById(
      @param.path.string('id') id: string,
      @requestBody() data: T,
    ): Promise<void> {
      await this.repository.replaceById(id, data);
    }

    @del(`${basePath}/{id}`)
    @response(204, {description: `${modelCtor.name} DELETE success`})
    async deleteById(@param.path.string('id') id: string): Promise<void> {
      await this.repository.deleteById(id);
    }
  }

  return CrudController;
}
