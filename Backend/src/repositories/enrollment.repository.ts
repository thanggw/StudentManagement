import {inject, Getter} from '@loopback/core';
import {juggler, BelongsToAccessor, repository} from '@loopback/repository';
import {Enrollment, EnrollmentRelations} from '../models/enrollment.model';
import {Student} from '../models';
import {Course} from '../models/course.model';
import {BaseRepository} from './base.repository';
import {StudentRepository} from './student.repository';
import {CourseRepository} from './course.repository';

export class EnrollmentRepository extends BaseRepository<
  Enrollment,
  typeof Enrollment.prototype.id,
  EnrollmentRelations
> {
  public readonly student: BelongsToAccessor<
    Student,
    typeof Enrollment.prototype.id
  >;

  public readonly course: BelongsToAccessor<
    Course,
    typeof Enrollment.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: juggler.DataSource,
    @repository.getter('StudentRepository')
    protected studentRepositoryGetter: Getter<StudentRepository>,
    @repository.getter('CourseRepository')
    protected courseRepositoryGetter: Getter<CourseRepository>,
  ) {
    super(Enrollment, dataSource);

    this.course = this.createBelongsToAccessorFor(
      'course',
      courseRepositoryGetter,
    );
    this.registerInclusionResolver('course', this.course.inclusionResolver);

    this.student = this.createBelongsToAccessorFor(
      'student',
      studentRepositoryGetter,
    );
    this.registerInclusionResolver('student', this.student.inclusionResolver);
  }
}
