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
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { IsThatUser } from 'src/auth/decorators/is-that-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { type paginationDto } from 'src/common/dto/pagination.dto';
import { AwsService } from 'src/aws/aws.service';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly awsService: AwsService,
  ) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @IsThatUser('id') user: User,
  ) {
    if (!file) {
      throw new BadRequestException('You must upload an image');
    }
    const image = await this.awsService.uploadImage(file);
    if (!image.Location) {
      throw new BadRequestException('Error uploading image');
    }
    return this.postService.create(id, image.Location, createPostDto);
  }

  @Get()
  async findAll(@Query() pagination: paginationDto) {
    console.log({ pagination });

    return await this.postService.findAll(pagination);
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
