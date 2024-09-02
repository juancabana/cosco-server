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
import { PostService } from 'src/post/post.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { hashSync } from 'bcrypt';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly postService: PostService,
    private readonly notificationsSevice: NotificationsService,
    private readonly awsService: AwsService,
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

      // Excluir la propiedad password del objeto retornado
      const { password: _, ...userWithoutPassword } = user.toObject({
        getters: true,
        virtuals: true,
      });
      return userWithoutPassword;
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
      .select(
        'email password isActive _id firstName lastName image secondName secondLastName',
      )
      .lean();
    if (!user)
      throw new UnauthorizedException(`Credentials are not valid (email)`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    // Verificar si la imagen está presente y no está vacía
    if (updateUserDto.image && typeof updateUserDto.image === 'string') {
      const { Location } = await this.awsService.uploadImage(
        updateUserDto.image,
        `${id}-profile`,
      );
      updateUserDto.image = Location;
    }

    // return { ...user.toJSON(), ...updateUserDto };

    // // Actualizar los datos del usuario
    Object.assign(user, updateUserDto);
    await user.save();

    return user.toObject();
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

  // async uploadFile(id: string, file: Express.Multer.File) {
  //   const image = await this.cloudinaryService.uploadFile(file);
  //   const newUser = await this.update(id, { image: image.secure_url });

  //   return newUser;
  // }

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
