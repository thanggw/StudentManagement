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
  response,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {createCrudController} from './base.controller';
import {authenticate, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import * as bcrypt from 'bcrypt';
import {MyUserService, Credentials} from '../services/user.service';
import {SignUpRequest} from '../dto/signup-request.dto';

const BaseUserController = createCrudController<User, UserRepository>(
  User,
  '/users',
);

export class UserController extends BaseUserController {
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

  @post('/users/signup')
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 6},
              name: {type: 'string'},
              roles: {
                type: 'array',
                items: {type: 'string'},
                default: ['user'],
              },
            },
          },
        },
      },
    })
    userData: SignUpRequest,
  ): Promise<User> {
    const email = userData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpErrors.BadRequest('Invalid email format');
    }
    const existingUser = await this.userRepository.findOne({where: {email}});
    if (existingUser) {
      throw new HttpErrors.BadRequest('User already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    // Tạo user (loại bỏ password)
    const createdUser = await this.userRepository.create({
      email,
      name: userData.name,
      roles: userData.roles ?? ['user'],
    });
    await this.userRepository.userCredentials(createdUser.id!).create({
      usersId: createdUser.id!,
      password: hashedPassword,
    });
    return createdUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Login success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {token: {type: 'string'}},
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
  @get('/users/me')
  @response(200, {
    description: 'Current user profile',
    content: {
      'application/json; charset=utf-8': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
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
  @patch('/users/me')
  @response(200, {
    description: 'Update current user profile',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async updateCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            partial: true,
            exclude: ['id', 'roles', 'email', 'userCredentials'],
          }),
        },
      },
    })
    userData: Partial<User>,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    if ((userData as any).password) {
      delete (userData as any).password;
    }
    await this.userRepository.updateById(userId, userData);
    return this.userRepository.findById(userId);
  }

  @authenticate('jwt')
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return super.find(filter);
  }

  @authenticate('jwt')
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
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
  @del('/users/{id}')
  @response(204, {description: 'User DELETE success'})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    return super.deleteById(id);
  }
}
