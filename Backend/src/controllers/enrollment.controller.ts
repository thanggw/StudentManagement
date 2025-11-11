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
  repository,
} from '@loopback/repository';
import {Enrollment} from '../models/enrollment.model';
import {Student} from '../models';
import {Course} from '../models/course.model';
import {EnrollmentRepository} from '../repositories/enrollment.repository';
import {BaseController} from './base.controller';

export class EnrollmentController extends BaseController<
  Enrollment,
  EnrollmentRepository
> {
  constructor(
    @repository(EnrollmentRepository)
    public enrollmentRepository: EnrollmentRepository,
  ) {
    super(enrollmentRepository);
  }

  @post('/enrollments')
  @response(200, {
    description: 'Enrollment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Enrollment)}},
  })
  async createEnrollment(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enrollment, {exclude: ['id']}),
        },
      },
    })
    data: Omit<Enrollment, 'id'>,
  ): Promise<Enrollment> {
    return this.create(data);
  }

  @get('/enrollments/count')
  @response(200, {
    description: 'Enrollment count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countEnrollment(
    @param.where(Enrollment) where?: Where<Enrollment>,
  ): Promise<Count> {
    return this.count(where);
  }

  @get('/enrollments')
  @response(200, {
    description: 'Array of Enrollment instances with relations',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Enrollment, {includeRelations: true}),
        },
      },
    },
  })
  async findEnrollments(
    @param.filter(Enrollment) filter?: Filter<Enrollment>,
  ): Promise<Enrollment[]> {
    return this.find({
      ...filter,
      include: [{relation: 'student'}, {relation: 'course'}],
    });
  }

  @get('/enrollments/{id}')
  @response(200, {
    description: 'Enrollment instance with relations',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Enrollment, {includeRelations: true}),
      },
    },
  })
  async findEnrollmentById(
    @param.path.string('id') id: string,
    @param.filter(Enrollment, {exclude: 'where'})
    filter?: FilterExcludingWhere<Enrollment>,
  ): Promise<Enrollment> {
    return this.findById(id, filter);
  }

  @patch('/enrollments/{id}')
  @response(204, {description: 'Enrollment PATCH success'})
  async updateEnrollmentById(
    @param.path.string('id') id: string,
    @requestBody() data: Partial<Enrollment>,
  ): Promise<void> {
    await this.updateById(id, data);
  }

  @put('/enrollments/{id}')
  @response(204, {description: 'Enrollment PUT success'})
  async replaceEnrollmentById(
    @param.path.string('id') id: string,
    @requestBody() data: Enrollment,
  ): Promise<void> {
    await this.replaceById(id, data);
  }

  @del('/enrollments/{id}')
  @response(204, {description: 'Enrollment DELETE success'})
  async deleteEnrollmentById(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.deleteById(id);
  }

  // Lấy danh sách khóa học mà một sinh viên đã đăng ký
  @get('/students/{studentId}/courses')
  @response(200, {
    description: 'List of Courses a Student enrolled in',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Course)},
      },
    },
  })
  async findCoursesByStudent(
    @param.path.string('studentId') studentId: string,
  ): Promise<Course[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: {studentId},
      include: [{relation: 'course'}],
    });
    return enrollments.map(e => e.course!).filter(Boolean);
  }

  // Lấy danh sách sinh viên trong một khóa học
  @get('/courses/{courseId}/students')
  @response(200, {
    description: 'List of Students enrolled in a Course',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Student)},
      },
    },
  })
  async findStudentsByCourse(
    @param.path.string('courseId') courseId: string,
  ): Promise<Student[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: {courseId},
      include: [{relation: 'student'}],
    });
    return enrollments.map(e => e.student!).filter(Boolean);
  }
}
