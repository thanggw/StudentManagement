import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {Course, CourseWithRelations} from './course.model';
import {Student} from './student.model';

@model()
export class CartItem extends BaseEntity {
  @belongsTo(() => Student, {name: 'student'})
  studentId: string;

  @belongsTo(() => Course, {name: 'course'})
  courseId: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  addedAt?: Date;

  @property({
    type: 'string',
    default: 'pending', // pending | registered
  })
  status?: 'pending' | 'registered';

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface CartItemRelations {
  course?: CourseWithRelations;
}

export type CartItemWithRelations = CartItem & CartItemRelations;
