import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
// Mongo
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://cabanajuan:Password123@cluster0.g0qhylu.mongodb.net/cosco-server',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
