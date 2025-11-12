import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcrypt';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

// Định nghĩa Credentials interface
export interface Credentials {
  email: string;
  password: string;
}

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async verifyCredentials(credentials: {email: string; password: string}) {
    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }

    const userCreds = await this.userRepository
      .userCredentials(foundUser.id)
      .get();
    const isPasswordMatched = await bcrypt.compare(
      credentials.password,
      userCreds.password,
    );
    if (!isPasswordMatched) {
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
