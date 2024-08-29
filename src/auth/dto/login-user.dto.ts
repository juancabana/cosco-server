import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  Matches,
  MinLength,
  IsEmail,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,50}/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
