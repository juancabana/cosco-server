import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly CloudinaryService: CloudinaryService,
  ) {}

  async create(
    id: string,
    file: Express.Multer.File,
    createPostDto: CreatePostDto,
  ) {
    try {
      const user = await this.userService.findById(id);
      if (!user)
        throw new BadRequestException(
          `You cannot associate the post to a user that does not exist`,
        );
      const { secure_url } = await this.CloudinaryService.uploadFile(file);
      return await this.postModel.create({
        owner: id,
        ...createPostDto,
        image: secure_url,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.postModel.find();
  }

  async findByID(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new BadRequestException(`Post with id "${id}" not found`);
    return post;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findByID(id);
      post.updateOne(post);
      return { ...post.toJSON(), ...updatePostDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.postModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Post with id "${id}" not found`);
    }
    return 'Post deleted';
  }

  async removeMany(id: string) {
    const res = await this.postModel.deleteMany({ owner: id });

    return res;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Post exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Post - Check server logs`,
    );
  }
}
