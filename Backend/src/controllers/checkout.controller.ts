import {post, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {CheckoutService} from '../services/checkout.service';
import {authenticate} from '@loopback/authentication';

export class CheckoutController {
  constructor(
    @inject('services.CheckoutService')
    private checkoutService: CheckoutService,
  ) {}
  @authenticate('jwt')
  @post('/checkout')
  async checkout(@requestBody() body: {studentId: string}) {
    const studentId = body.studentId;
    return this.checkoutService.checkout(studentId);
  }
}
