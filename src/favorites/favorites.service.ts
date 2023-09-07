import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './entities/favorite.entity';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<Favorite>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}
  async create(createFavoriteDto: CreateFavoriteDto) {
    const user = await this.userService.findById(createFavoriteDto.idUser);
    const post = await this.postService.findByID(createFavoriteDto.idPost);
    if (!user)
      return new BadRequestException(
        `User with id "${createFavoriteDto.idUser}" not found`,
      );
    if (!post)
      return new BadRequestException(
        `Post with id "${createFavoriteDto.idUser}" not found`,
      );
    return await this.favoriteModel.create(createFavoriteDto);
  }

  findAll() {
    return this.favoriteModel.find();
  }

  async findById(id: string) {
    const favorite = await this.favoriteModel.findById(id);
    if (!favorite)
      throw new BadRequestException(`Favorite Post with id "${id}" not found`);
    return favorite;
  }

  async remove(id: string) {
    const { deletedCount } = await this.favoriteModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Favorite post with id "${id}" not found`);
    }
    return 'Favorite post deleted';
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Favorite exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Favorite - Check server logs`,
    );
  }
}
