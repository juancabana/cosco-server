import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { UserModule } from 'src/user/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [PostController],
  providers: [PostService, AwsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => NotificationsModule),
  ],
  exports: [PostService],
})
export class PostModule {}
