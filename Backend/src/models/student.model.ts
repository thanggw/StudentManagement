import {model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from './base.model';
import {Enrollment, EnrollmentWithRelations} from './enrollment.model';
import {CartItem} from './cart-item.model';
@model()
export class Student extends BaseEntity {
  @property({
    type: 'string',
    required: true,
  })
  studentCode?: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName?: string;

  @property({
    type: 'string',
    required: true,
  })
  email?: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber?: string;

  @property({
    type: 'string',
    required: true,
  })
  major?: string;

  @property({
    type: 'number',
    required: true,
  })
  gpa?: number;

  @property({
    type: 'number',
    default: 2000,
  })
  admissionYear?: number;

  @property({
    type: 'string',
    required: true,
  })
  status?: string;

  @property({
    type: 'number',
    default: 0,
    mongodb: {dataType: 'Number'},
  })
  balance?: number;

  @hasMany(() => Enrollment, {keyTo: 'studentId'})
  enrollments?: EnrollmentWithRelations[];

  @hasMany(() => CartItem, {keyTo: 'studentId'})
  cartItems?: CartItem[];

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
  enrollments?: EnrollmentWithRelations[];
}

export type StudentWithRelations = Student & StudentRelations;
