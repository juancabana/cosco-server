import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostService } from 'src/post/post.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly postService: PostService,
    private readonly notificationsSevice: NotificationsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoriteService: FavoritesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.userModel.create({
        ...userData,
        password: hashSync(password, 10),
      });
      return user.toObject({ getters: true, virtuals: true });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email: email })
      .select('email password')
      .lean();
    if (!user)
      throw new UnauthorizedException(`Credentials are not valid (email)`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    await user.updateOne(updateUserDto);

    return { ...user.toJSON(), ...updateUserDto };
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`User with id "${id}" not found`);
    }
    await this.postService.removeMany(id);
    await this.favoriteService.removeAllUserFavorites(id);
    await this.notificationsSevice.removeUserNotifications(id);

    return 'User Deleted';
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    const image = await this.cloudinaryService.uploadFile(file);
    const newUser = await this.update(id, { image: image.secure_url });

    return newUser;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create User - Check server logs`,
    );
  }
}
