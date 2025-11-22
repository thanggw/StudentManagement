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
    const session = await this.studentRepository.dataSource.beginTransaction({
      timeout: 30000,
    });

    try {
      // 1. Lấy giỏ hàng từ Redis
      const cartKey = `cart:${studentId}`;
      const cartJson = await this.redisService.get(cartKey);
      if (!cartJson || cartJson === '[]') {
        throw new HttpErrors.BadRequest('Giỏ hàng trống');
      }
      const cart = JSON.parse(cartJson);

      // 2. Lấy thông tin khóa học + tính tổng tiền
      const courseIds = cart.map((item: any) => item.courseId);
      const courses = await this.courseRepository.find(
        {
          where: {id: {inq: courseIds}},
        },
        {transaction: session},
      );

      let totalAmount = 0;
      const orderItemsData = [];

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

      // 3. Kiểm tra số dư
      const student = await this.userRepository.findById(
        studentId,
        {},
        {transaction: session},
      );
      if ((student.balance ?? 0) < totalAmount) {
        throw new HttpErrors.PaymentRequired('Số dư không đủ để thanh toán');
      }

      // 4. Trừ tiền
      await this.userRepository.updateById(
        studentId,
        {balance: (student.balance ?? 0) - totalAmount},
        {transaction: session},
      );

      // 5. Tạo Order
      const order = await this.orderRepository.create(
        {
          studentId,
          totalAmount,
          status: 'completed',
        },
        {transaction: session},
      );

      // 6. Tạo OrderItem + cập nhật CartItem thành registered
      for (const itemData of orderItemsData) {
        const orderItem = await this.orderItemRepository.create(
          {
            orderId: order.id!,
            courseId: itemData.courseId,
            priceAtPurchase: itemData.priceAtPurchase,
          },
          {transaction: session},
        );

        // Cập nhật CartItem (nếu vẫn lưu trong DB)
        await this.cartItemRepository.updateAll(
          {status: 'registered'},
          {studentId, courseId: itemData.courseId},
          {transaction: session},
        );
      }

      // 7. Xóa giỏ hàng Redis
      await this.redisService.del(cartKey);

      // Commit transaction
      await session.commit();

      return {
        message: 'Thanh toán thành công!',
        orderId: order.id,
        totalAmount,
        remainingBalance: (student.balance ?? 0) - totalAmount,
      };
    } catch (error) {
      await session.rollback();
      console.error('Checkout failed, rolled back:', error);
      throw error;
    }
  }
}
