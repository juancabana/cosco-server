import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly UserService: UserService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { _id } = payload;
    const user = await this.UserService.findById(_id);

    if (!user) throw new UnauthorizedException(`Token isn't valid`);

    if (!user.isActive) {
      console.log(user.isActive);
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }

    return user;
  }
}
