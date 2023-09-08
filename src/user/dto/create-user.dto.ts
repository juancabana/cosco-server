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
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsAlpha()
  @MaxLength(15)
  @MinLength(1)
  username: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsEmail()
  @IsLowercase()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @Matches(/^(3[0-9]{2}|01[0-9]{2})[0-9]{7}$/)
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  role: string;
}
