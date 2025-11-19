import {repository} from '@loopback/repository';
import {
  get,
  param,
  post,
  requestBody,
  del,
  response,
  HttpErrors,
} from '@loopback/rest';
import {CartItemRepository} from '../repositories/cart-item.repository';
import {CourseRepository} from '../repositories/course.repository';
import {CartItem} from '../models/cart-item.model';
import {createCrudController} from './base.controller';
import {RedisService} from '../services/redis.service';
import {inject} from '@loopback/core';
const BaseCartController = createCrudController<CartItem, CartItemRepository>(
  CartItem,
  '/cart-items',
);

export class CartItemController extends BaseCartController {
  constructor(
    @repository(CartItemRepository)
    public cartItemRepository: CartItemRepository,
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
  ) {
    super(cartItemRepository);
  }

  @post('/cart-items/add')
  async addToCart(
    @requestBody() data: {studentId: string; courseId: string},
    @inject('services.RedisService') redis: RedisService,
  ) {
    const {studentId, courseId} = data;
    const key = `cart:${studentId}`;

    // Lấy giỏ hiện tại từ redis
    const cartJson = await redis.get(key);
    const cart = cartJson ? JSON.parse(cartJson) : [];

    // Kiểm tra trùng
    if (cart.some((item: any) => item.courseId === courseId)) {
      throw new HttpErrors.Conflict('Course already in cart');
    }

    cart.push({
      courseId,
      addedAt: new Date().toISOString(),
    });

    await redis.set(key, JSON.stringify(cart));
    return {message: 'Added to cart (Redis)', cart};
  }

  @get('/cart-items/student/{studentId}')
  async getCart(
    @param.path.string('studentId') studentId: string,
    @inject('services.RedisService') redis: RedisService,
  ) {
    const key = `cart:${studentId}`;
    const cartJson = await redis.get(key);
    const cart = cartJson ? JSON.parse(cartJson) : [];

    // Join với Course từ DB để lấy tên, tín chỉ
    const courseIds = cart.map((item: any) => item.courseId);
    const courses = await this.courseRepository.find({
      where: {id: {inq: courseIds}},
    });

    const items = cart.map((item: any) => {
      const course = courses.find(c => c.id === item.courseId);
      return {course, addedAt: item.addedAt};
    });

    return {
      items,
      total: items.length,
      totalCredits: items.reduce(
        (sum: number, i: any) => sum + (i.course?.credits || 0),
        0,
      ),
    };
  }

  @del('/cart-items/{id}')
  @response(204, {
    description: 'Remove item from cart',
  })
  async removeFromCart(@param.path.string('id') id: string) {
    const item = await this.cartItemRepository.findById(id);
    if (item.status !== 'pending') {
      throw new HttpErrors.BadRequest('Cannot remove registered course');
    }
    await this.cartItemRepository.deleteById(id);
  }
}
