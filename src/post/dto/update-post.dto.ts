import { PartialType } from '@nestjs/swagger/dist';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
