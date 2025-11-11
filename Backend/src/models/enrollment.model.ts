import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {Student, StudentWithRelations} from './student.model';
import {Course, CourseWithRelations} from './course.model';

@model()
export class Enrollment extends BaseEntity {
  @belongsTo(() => Student, {name: 'student'})
  studentId: string;

  @belongsTo(() => Course, {name: 'course'})
  courseId: string;

  @property({
    type: 'string',
    required: true,
  })
  semester: string;

  @property({
    type: 'number',
  })
  midtermScore?: number;

  @property({
    type: 'number',
  })
  finalScore?: number;

  @property({
    type: 'string',
  })
  grade?: string; // 'A', 'B+', 'C'

  constructor(data?: Partial<Enrollment>) {
    super(data);
  }
}

export interface EnrollmentRelations {
  // describe navigational properties here
  student?: StudentWithRelations;
  course?: CourseWithRelations;
}

export type EnrollmentWithRelations = Enrollment & EnrollmentRelations;
