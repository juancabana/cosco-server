import { PartialType } from '@nestjs/swagger/dist';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
