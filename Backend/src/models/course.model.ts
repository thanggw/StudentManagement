import {model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {Enrollment, EnrollmentWithRelations} from './enrollment.model';
import {CartItem} from './cart-item.model';
@model()
export class Course extends BaseEntity {
  @property({
    type: 'string',
    required: true,
  })
  courseCode: string;

  @property({
    type: 'string',
    required: true,
  })
  courseName: string;

  @property({
    type: 'number',
    required: true,
  })
  credits: number;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => Enrollment, {keyTo: 'courseId'})
  enrollments?: EnrollmentWithRelations[];

  @hasMany(() => CartItem, {keyTo: 'courseId'})
  cartItems?: CartItem[];

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
  enrollments?: EnrollmentWithRelations[];
}

export type CourseWithRelations = Course & CourseRelations;
