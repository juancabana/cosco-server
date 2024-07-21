import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from 'src/post/post.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => PostModule),
    forwardRef(() => NotificationsModule),
    FavoritesModule,
  ],
  exports: [UserService],
})
export class UserModule {}
