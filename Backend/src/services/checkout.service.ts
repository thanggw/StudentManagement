import {injectable, BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {StudentRepository} from '../repositories';
import {CourseRepository} from '../repositories/course.repository';
import {CartItemRepository} from '../repositories/cart-item.repository';
import {OrderRepository} from '../repositories/order.repository';
import {OrderItemRepository} from '../repositories/order-item.repository';
import {HttpErrors} from '@loopback/rest';
import {RedisService} from './redis.service';
import {UserRepository} from '@loopback/authentication-jwt';
@injectable({scope: BindingScope.TRANSIENT})
export class CheckoutService {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
    @repository(CartItemRepository)
    public cartItemRepository: CartItemRepository,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(OrderItemRepository)
    public orderItemRepository: OrderItemRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('services.RedisService')
    public redisService: RedisService,
  ) {}

  async checkout(studentId: string) {
    try {
      // 1. Lấy giỏ hàng từ Redis
      const cartKey = `cart:${studentId}`;
      const cartJson = await this.redisService.get(cartKey);

      if (!cartJson || cartJson === '[]') {
        throw new HttpErrors.BadRequest('Giỏ hàng trống');
      }

      const cart = JSON.parse(cartJson);
      const courseIds = cart.map((item: any) => item.courseId);

      // 2. Lấy khóa học + tính tổng tiền
      const courses = await this.courseRepository.find({
        where: {id: {inq: courseIds}},
      });

      let totalAmount = 0;
      const orderItemsData: Array<any> = [];

      for (const item of cart) {
        const course = courses.find(c => c.id === item.courseId);
        if (!course)
          throw new HttpErrors.NotFound(`Course ${item.courseId} not found`);

        if (course.price == null)
          throw new HttpErrors.BadRequest(
            `Course ${course.courseCode} chưa có giá`,
          );

        totalAmount += course.price;

        orderItemsData.push({
          courseId: course.id,
          priceAtPurchase: course.price,
        });
      }

      // 3. Trừ tiền
      const result = await this.userRepository.updateAll(
        {
          id: studentId,
          balance: {gte: totalAmount},
        },
        {
          $inc: {balance: -totalAmount},
        },
      );

      if (result.count === 0) {
        throw new HttpErrors.PaymentRequired('Số dư không đủ để thanh toán');
      }

      // 4. tạo order + order items
      const session = await this.orderRepository.dataSource.beginTransaction();

      try {
        const order = await this.orderRepository.create(
          {
            studentId,
            totalAmount,
            status: 'completed',
          },
          {transaction: session},
        );

        for (const itemData of orderItemsData) {
          await this.orderItemRepository.create(
            {
              orderId: order.id!,
              courseId: itemData.courseId,
              priceAtPurchase: itemData.priceAtPurchase,
            },
            {transaction: session},
          );

          await this.cartItemRepository.updateAll(
            {status: 'registered'},
            {studentId, courseId: itemData.courseId},
            {transaction: session},
          );
        }

        // Xóa giỏ hàng Redis
        await this.redisService.del(cartKey);

        await session.commit();

        return {
          message: 'Thanh toán thành công!',
          orderId: order.id,
          totalAmount,
        };
      } catch (innerError) {
        await session.rollback();

        // Số các bước sau thằng trừ tiền mà lỗi thì hoàn tiền lại
        await this.userRepository.updateById(studentId, {
          $inc: {balance: totalAmount},
        });

        throw innerError;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  }
}
