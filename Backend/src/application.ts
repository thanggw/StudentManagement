import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {MongodbDataSource} from './datasources';
import {MyUserService} from './services/user.service';

export {ApplicationConfig};

export const CUSTOM_USER_SERVICE = 'services.CustomUserService';

export class MyLoopbackAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);

    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // Bind datasource
    this.dataSource(MongodbDataSource, UserServiceBindings.DATASOURCE_NAME);

    // Bind JWT configuration
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      process.env.JWT_SECRET || 'my-jwt-secret-key',
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env.JWT_EXPIRES_IN || '3600',
    );

    // Bind custom user service với custom binding key
    this.bind(CUSTOM_USER_SERVICE).toClass(MyUserService);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
