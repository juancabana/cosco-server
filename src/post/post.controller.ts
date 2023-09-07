import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':id')
  create(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(id, createPostDto);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.postService.findByID(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.postService.remove(id);
  }
}
