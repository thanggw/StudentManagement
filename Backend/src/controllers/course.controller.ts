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
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';
import {Course} from '../models/course.model';
import {CourseRepository} from '../repositories/course.repository';
import {BaseController} from './base.controller';
import {repository} from '@loopback/repository';

export class CourseController extends BaseController<Course, CourseRepository> {
  constructor(
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
  ) {
    super(courseRepository);
  }

  @post('/courses')
  @response(200, {
    description: 'Course model instance',
    content: {'application/json': {schema: getModelSchemaRef(Course)}},
  })
  async createCourse(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {exclude: ['id']}),
        },
      },
    })
    data: Omit<Course, 'id'>,
  ): Promise<Course> {
    return this.create(data);
  }

  @get('/courses/count')
  @response(200, {
    description: 'Course count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countCourse(
    @param.where(Course) where?: Where<Course>,
  ): Promise<Count> {
    return this.count(where);
  }

  @get('/courses')
  @response(200, {
    description: 'Array of Course model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Course, {includeRelations: true}),
        },
      },
    },
  })
  async findCourses(
    @param.filter(Course) filter?: Filter<Course>,
  ): Promise<Course[]> {
    return this.find(filter);
  }

  @get('/courses/{id}')
  @response(200, {
    description: 'Course model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Course, {includeRelations: true}),
      },
    },
  })
  async findCourseById(
    @param.path.string('id') id: string,
    @param.filter(Course, {exclude: 'where'})
    filter?: FilterExcludingWhere<Course>,
  ): Promise<Course> {
    return this.findById(id, filter);
  }

  @patch('/courses/{id}')
  @response(204, {description: 'Course PATCH success'})
  async updateCourseById(
    @param.path.string('id') id: string,
    @requestBody() data: Partial<Course>,
  ): Promise<void> {
    await this.updateById(id, data);
  }

  @put('/courses/{id}')
  @response(204, {description: 'Course PUT success'})
  async replaceCourseById(
    @param.path.string('id') id: string,
    @requestBody() data: Course,
  ): Promise<void> {
    await this.replaceById(id, data);
  }

  @del('/courses/{id}')
  @response(204, {description: 'Course DELETE success'})
  async deleteCourseById(@param.path.string('id') id: string): Promise<void> {
    await this.deleteById(id);
  }
}
