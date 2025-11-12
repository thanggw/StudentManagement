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
import {createCrudController} from './base.controller';

const BaseEnrollmentController = createCrudController<
  Enrollment,
  EnrollmentRepository
>(Enrollment, '/enrollments');

export class EnrollmentController extends BaseEnrollmentController {
  constructor(
    @repository(EnrollmentRepository)
    public enrollmentRepository: EnrollmentRepository,
  ) {
    super(enrollmentRepository);
  }

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
