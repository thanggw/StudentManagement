import {
  Count,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {BaseController} from './base.controller';
import {authenticate, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import * as bcrypt from 'bcrypt';
import {MyUserService, Credentials} from '../services/user.service';

export class UserController extends BaseController<User, UserRepository> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject('services.CustomUserService')
    public userService: MyUserService,
  ) {
    super(userRepository);
  }

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User sign up',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'createdAt', 'updatedAt', 'deleted'],
          }),
        },
      },
    })
    userData: Omit<User, 'id'>,
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: {email: userData.email},
    });
    if (existingUser) {
      throw new HttpErrors.BadRequest('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    return this.userRepository.create(userData);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/users/me', {
    responses: {
      '200': {
        description: 'Current user profile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async getCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findById(userId);
  }

  @authenticate('jwt')
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return super.find(filter);
  }

  @authenticate('jwt')
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return super.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
  ): Promise<void> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return super.updateById(id, user);
  }

  @authenticate('jwt')
  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return super.replaceById(id, user);
  }

  @authenticate('jwt')
  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    return super.deleteById(id);
  }
}
