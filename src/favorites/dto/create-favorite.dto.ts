import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty()
  @IsMongoId()
  idUser: string;

  @ApiProperty()
  @IsMongoId()
  idPost: string;
}
