import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { ...user, token: this.getJwt({ _id: user._id }) };
  }

  async login(loginUserAuthDto: LoginUserDto) {
    const { email, password } = loginUserAuthDto;
    const user = await this.userService.findByEmail(email);

    const { password: passwordUser, ...userWithoutPassword } = user;

    if (!compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    return {
      ...userWithoutPassword,
      token: this.getJwt({ _id: userWithoutPassword._id }),
    };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
