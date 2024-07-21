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
import { NotificationsService } from 'src/notifications/notifications.service';
import { paginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(id: string, file: string, createPostDto: CreatePostDto) {
    try {
      const user = await this.userService.findById(id);
      if (!user)
        throw new BadRequestException(
          `You cannot associate the post to a user that does not exist`,
        );

      const newPost = await this.postModel.create({
        owner: id,
        image: file,
        ...createPostDto,
      });
      await this.notificationService.create({
        idUser: id,
        message: `Has publicado un nuevo producto`,
      });

      return newPost;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: paginationDto) {
    const { limit = 2, offset = 0 } = paginationDto;
    return await this.postModel.find({}, '-__v').limit(limit).skip(offset);
  }

  async findByID(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new BadRequestException(`Post with id "${id}" not found`);
    return post;
  }

  async findAllUserPosts(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);

    const post = await this.postModel.find({ owner: id });
    return post;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findByID(id);
      await post.updateOne(post);

      await this.notificationService.create({
        idUser: post.owner,
        message: `Tu publicacion se ha actualizado correctamente`,
      });

      return { ...post.toJSON(), ...updatePostDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const post = await this.findByID(id);
    // const { deletedCount } = await this.postModel.deleteOne({ _id: id });
    if (!post) {
      throw new BadRequestException(`Post with id "${id}" not found`);
    }
    await this.postModel.deleteOne({ _id: id });
    await this.notificationService.create({
      idUser: post.owner,
      message: `Tu publicacion se ha eliminado correctamente`,
    });
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
