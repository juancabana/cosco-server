import { IsMongoId, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  idUser: string;

  @IsString()
  message: string;
}
