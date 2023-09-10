import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';
import { IsThatUser } from 'src/auth/decorators/is-that-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':idUser/:idPost')
  async create(
    @Param('idUser', ParseMongoIdPipe) idUser: string,
    @Param('idPost', ParseMongoIdPipe) idPost: string,
  ) {
    return await this.favoritesService.create({ idUser, idPost });
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'))
  findUserFavorites(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.favoritesService.findAllUserFavorites(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.favoritesService.findById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.favoritesService.remove(id);
  }
}
