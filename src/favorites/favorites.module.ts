import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './entities/favorite.entity';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Favorite.name,
        schema: FavoriteSchema,
      },
    ]),
    forwardRef(() => UserModule),
    PostModule,
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
