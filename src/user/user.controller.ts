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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/cloudinary/helpers/fileFilter.helper';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create User
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Get all users
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findAll();
  }

  // Get user by ID
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.findById(id);
  }

  // Update info User
  @Patch(':id')
  // Validate image
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Update and upload image
  @Post('update-image/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async uploadImage(
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log({ fileInController: file });
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    return await this.userService.uploadFile(id, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
