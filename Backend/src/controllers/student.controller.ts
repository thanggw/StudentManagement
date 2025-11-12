import {repository} from '@loopback/repository';
import {createCrudController} from './base.controller';
import {Student} from '../models';
import {StudentRepository} from '../repositories';

const BaseStudentController = createCrudController<Student, StudentRepository>(
  Student,
  '/students',
);

export class StudentController extends BaseStudentController {
  constructor(
    @repository(StudentRepository)
    repo: StudentRepository,
  ) {
    super(repo);
  }
}
