import * as request from 'supertest';
import {
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const IsThatUser = createParamDecorator(
  (idReq, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // Id req
    const user = req.user;
    const id = req.params[idReq];

    console.log({ user, id });
    if (!user)
      throw new InternalServerErrorException('User not found (Request)');
    if (user.id != id)
      throw new UnauthorizedException(
        'You aren´t authorized to do actions in this user',
      );
    return user;
  },
);
