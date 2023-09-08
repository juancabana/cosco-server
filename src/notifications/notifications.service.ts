import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notificationModel.create(createNotificationDto);
  }

  async findAll() {
    return await this.notificationModel.find();
  }
  async findAllUserNotifications(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);

    const post = await this.notificationModel.find({ idUser: id });
    return post;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async remove(id: string) {
    const { deletedCount } = await this.notificationModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) {
      throw new BadRequestException(`Notification with id "${id}" not found`);
    }
    return 'Notification deleted';
  }
  async removeUserNotifications(id: string) {
    const { deletedCount } = await this.notificationModel.deleteMany({
      idUser: id,
    });
    return 'Notifications deleted';
  }
}
