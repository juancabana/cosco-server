import { Controller, Get, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post(':id')
  // create(
  //   @Param('id', ParseMongoIdPipe) id: string,
  //   @Body() createNotificationDto: CreateNotificationDto,
  // ) {
  //   return this.notificationsService.create({
  //     idUser: id,
  //     ...createNotificationDto,
  //   });
  // }

  @Get()
  async findAll() {
    return await this.notificationsService.findAll();
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
