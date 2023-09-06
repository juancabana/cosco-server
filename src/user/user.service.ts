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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return `This action updates a #${id} user`;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`User with id "${id}" not found`);

    return 'User Deleted';
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
