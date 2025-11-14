import {repository} from '@loopback/repository';
import {createCrudController} from './base.controller';
import {Student} from '../models';
import {StudentRepository} from '../repositories';
import {get, param, response} from '@loopback/rest';

const BaseStudentController = createCrudController<Student, StudentRepository>(
  Student,
  '/students',
);

export class StudentController extends BaseStudentController {
  constructor(
    @repository(StudentRepository)
    public repo: StudentRepository,
  ) {
    super(repo);
  }
  @get('/students/search')
  @response(200, {
    description: 'Filtered list of students by major, status, with pagination',
  })
  async findByMajorAndStatus(
    @param.query.string('major') major?: string,
    @param.query.string('status') status?: string,
    @param.query.number('page') page = 1,
    @param.query.number('limit') limit = 10,
  ): Promise<object> {
    const where: any = {};
    if (major) where.major = major;
    if (status) where.status = status;

    return this.repository.findWithPagination({where}, page, limit);
  }
}
