import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  Matches,
  MinLength,
  IsMongoId,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
