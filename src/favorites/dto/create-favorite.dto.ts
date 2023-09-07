import { IsMongoId } from 'class-validator';

export class CreateFavoriteDto {
  @IsMongoId()
  idUser: string;

  @IsMongoId()
  idPost: string;
}
