import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlpha,
  MaxLength,
  IsEmail,
  Matches,
  IsOptional,
  IsUrl,
  MinLength,
  IsLowercase,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MaxLength(15)
  @MinLength(1)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(3[0-9]{2}|01[0-9]{2})[0-9]{7}$/)
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsIn(['OWNER', 'CUSTOMER'])
  role: string;
}
