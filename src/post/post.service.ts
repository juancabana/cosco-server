import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async create(id: string, createPostDto: CreatePostDto) {
    const user = await this.postModel.findById(id);
    if (!user)
      throw new BadRequestException(
        `You cannot associate the post to a user that does not exist`,
      );
    return await this.postModel.create({ owner: id, ...createPostDto });
  }

  async findAll() {
    return await this.postModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    const { deletedCount } = await this.postModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Post with id "${id}" not found`);
    }
  }
  async removeMany(id: string) {
    const res = await this.postModel.deleteMany({ owner: id });
    // if (deletedCount === 0) {
    //   throw new BadRequestException(`Post with id "${id}" not found`);
    // }
    return res;
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
