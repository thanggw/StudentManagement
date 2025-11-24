import {HttpErrors, post, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {CheckoutService} from '../services/checkout.service';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {MyUserProfile} from '../dto/MyUserProfile';

export class CheckoutController {
  constructor(
    @inject('services.CheckoutService')
    private checkoutService: CheckoutService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentUser: MyUserProfile,
  ) {}
  @authenticate('jwt')
  @post('/checkout')
  async checkout() {
    const studentId = this.currentUser.id;
    if (!studentId) {
      throw new HttpErrors.Forbidden('Không thể xác thực người dùng');
    }
    return this.checkoutService.checkout(studentId);
  }
}
