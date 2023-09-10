import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';
import { IsThatUser } from 'src/auth/decorators/is-that-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll() {
    return await this.notificationsService.findAll();
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'))
  findUserNotifications(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.notificationsService.findAllUserNotifications(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.notificationsService.remove(id);
  }
  @Delete('clean-user/:id')
  @UseGuards(AuthGuard('jwt'))
  cleanNotifications(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.notificationsService.removeUserNotifications(id);
  }
}
