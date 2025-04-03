import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  //   private logger = new Logger('UsersService');
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un usuario.
   * @param registerUserDto DTO para registrar un usuario.
   * @returns Información del usuario y el token.
   */
  async register(registerUserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = registerUserDto;

      const user: any = await firstValueFrom(
        this.client.send('CREATE_USER', {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        }),
      );

      return {
        ...user,
        token: this.signJWT({ id: user.id, role: user.role }),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user: any = await firstValueFrom(
        this.client.send('FIND_USER_BY_ID', { term: email }),
      );

      if (!bcrypt.compareSync(password, user.password)) {
        throw new RpcException({
          status: 400,
          message: 'Password not valid',
        });
      }

      const { password: __, ...rest } = user;
      return {
        ...rest,
        token: this.signJWT({ id: user.id, role: user.role }),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  private signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
