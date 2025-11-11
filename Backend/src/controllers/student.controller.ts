import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Student} from '../models';
import {StudentRepository} from '../repositories';
import {BaseController} from './base.controller';

export class StudentController extends BaseController<
  Student,
  StudentRepository
> {
  constructor(
    @repository(StudentRepository)
    protected studentRepository: StudentRepository,
  ) {
    super(studentRepository);
  }

  @post('/students')
  @response(200, {
    description: 'Student model instance',
    content: {'application/json': {schema: getModelSchemaRef(Student)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudent',
            exclude: ['id'],
          }),
        },
      },
    })
    student: Omit<Student, 'id'>,
  ): Promise<Student> {
    return super.create(student);
  }

  @get('/students/count')
  @response(200, {
    description: 'Student model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Student) where?: Where<Student>): Promise<Count> {
    return super.count(where);
  }

  @get('/students')
  @response(200, {
    description: 'Array of Student model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Student, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Student) filter?: Filter<Student>,
  ): Promise<Student[]> {
    return super.find(filter);
  }

  @patch('/students')
  @response(200, {
    description: 'Student PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
    @param.where(Student) where?: Where<Student>,
  ): Promise<Count> {
    return this.repository.updateAll(student, where);
  }

  @get('/students/{id}')
  @response(200, {
    description: 'Student model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Student, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Student, {exclude: 'where'})
    filter?: FilterExcludingWhere<Student>,
  ): Promise<Student> {
    return super.findById(id, filter);
  }

  @patch('/students/{id}')
  @response(204, {
    description: 'Student PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>, // Fix type để khớp partial schema
  ): Promise<void> {
    await super.updateById(id, student);
  }

  @put('/students/{id}')
  @response(204, {
    description: 'Student PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() student: Student,
  ): Promise<void> {
    await super.replaceById(id, student);
  }

  @del('/students/{id}')
  @response(204, {
    description: 'Student DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await super.deleteById(id);
  }
}
