import {
  IsString,
  IsAlpha,
  MaxLength,
  IsEmail,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsAlpha()
  @MaxLength(15)
  username: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Matches(/^(3[0-9]{2}|01[0-9]{2})[0-9]{7}$/)
  phoneNumber: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  description: string;

  @IsString()
  role: string;
}
