import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
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
    @Inject(forwardRef(() => UserService))
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

  async findAllUserFavorites(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException(`User with id "${id}" not found`);

    const favorites = await this.favoriteModel.find({ idUser: id });
    return favorites;
  }
  async removeAllUserFavorites(id: string) {
    const favorites = await this.favoriteModel.deleteMany({ idUser: id });
    return favorites;
  }

  async remove(id: string) {
    const { deletedCount } = await this.favoriteModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Favorite post with id "${id}" not found`);
    }
    return 'Favorite post deleted';
  }
}
