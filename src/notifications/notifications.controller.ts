import { Controller, Get, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll() {
    return await this.notificationsService.findAll();
  }

  @Get('user/:id')
  findUserNotifications(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.findAllUserNotifications(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.remove(id);
  }
  @Delete('clean-user/:id')
  cleanNotifications(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.removeUserNotifications(id);
  }
}
