import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userModel.create(createUserDto);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    await user.updateOne(updateUserDto);

    return { ...user.toJSON(), ...updateUserDto };
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`User with id "${id}" not found`);

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
