import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsMongoId()
  idUser: string;

  @IsString()
  message: string;
}
