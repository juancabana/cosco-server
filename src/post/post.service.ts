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
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService,
    private readonly awsService: AwsService,
  ) {}

  async create(id: string, createPostDto: CreatePostDto) {
    try {
      const user = await this.userService.findById(id);
      if (!user)
        throw new BadRequestException(
          `You cannot associate the post to a user that does not exist`,
        );

      const images = await Promise.all(
        createPostDto.images.map((image) => {
          const randomNumber = `${Math.random()}`;
          return this.awsService.uploadImage(
            image,
            `${id}-profile-${randomNumber}`,
          );
        }),
      );

      const newPost = await this.postModel.create({
        ...createPostDto,
        owner: id,
        images: images.map((image) => image.Location),
      });

      return newPost;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // async findAll(paginationDto: PaginationDto) {
  async findAll(paginationDto: {
    limit?: number;
    offset?: number;
    category?: string;
    department?: string;
    city?: string;
    title?: string;
  }) {
    const {
      limit = 20,
      offset = 0,
      city,
      department,
      title,
      category,
    } = paginationDto;

    const query = {
      ...(city && { city }),
      ...(department && { department }),
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(category && { category }),
    };

    const [posts, total] = await Promise.all([
      this.postModel
        .find(query, '-__v')
        .populate('owner', '-password -isActive -__v')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.postModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      totalPages,
      currentPage: Math.floor(offset / limit) + 1,
    };
  }

  async findByID(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new BadRequestException(`Post with id "${id}" not found`);
    return post;
  }

  async findAllUserPosts(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);

    const post = await this.postModel
      .find({ owner: id })
      .populate('owner', '-password -isActive -__v');
    return post;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findByID(id);
      if (!post) {
        throw new Error('Post not found');
      }

      const rawImages = updatePostDto.images;

      const localImages = rawImages.filter(
        (image) => !image.includes('amazonaws'),
      );

      const awsImages = rawImages.filter((image) =>
        image.includes('amazonaws'),
      );

      const images = await Promise.all(
        localImages.map((image) => {
          const randomNumber = `${Math.random()}`;
          return this.awsService.uploadImage(
            image,
            `${post.owner}-profile-${randomNumber}`,
          );
        }),
      );

      // Update the post with the new data
      Object.assign(post, {
        ...updatePostDto,
        images: [...awsImages, ...images.map((image) => image.Location)],
      });

      // Save the updated post
      await post.save();

      // // Create a notification for the user
      // await this.notificationService.create({
      //   idUser: post.owner,
      //   message: `Tu publicacion se ha actualizado correctamente`,
      // });

      return { ...post.toJSON(), ...updatePostDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findFavoritePosts(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);

    const post = await this.postModel
      .find({ _id: { $in: user.favorites } })
      .populate('owner', '-password -isActive -__v -favorites');
    return post;
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
