import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { IsThatUser } from 'src/auth/decorators/is-that-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
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
  findAll() {
    return this.userService.findAll();
  }

  // Get user by ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.userService.findById(id);
  }

  // Create favorite post
  @Post('favorite/:idUser/:idPost')
  async createFavorite(
    @Param('idUser', ParseMongoIdPipe) idUser: string,
    @Param('idPost', ParseMongoIdPipe) idPost: string,
  ) {
    return await this.userService.createFavoritePost({ idUser, idPost });
  }

  // Update info User
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @IsThatUser('id') user: User,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @IsThatUser('id') user: User,
  ) {
    return this.userService.remove(id);
  }
}
