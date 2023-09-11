import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/cloudinary/helpers/fileFilter.helper';
import { AuthGuard } from '@nestjs/passport';
import { IsThatUser } from 'src/auth/decorators/is-that-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { paginationDto } from 'src/common/dto/pagination.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  create(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @IsThatUser('id') user: User,
  ) {
    if (!file) {
      throw new BadRequestException('You must upload an image');
    }
    // return { id, file, ...createPostDto };
    return this.postService.create(id, file, createPostDto);
  }

  @Get()
  async findAll(@Query() paginationDto: paginationDto) {
    console.log({ paginationDto });

    return await this.postService.findAll(paginationDto);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'))
  findUserPosts(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.postService.findAllUserPosts(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.postService.findByID(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @IsThatUser('id') user: User,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.postService.remove(id);
  }
}
