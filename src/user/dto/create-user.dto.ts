import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsEmail,
  Matches,
  IsOptional,
  MinLength,
  IsLowercase,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @MinLength(1)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @IsOptional()
  secondName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @MinLength(1)
  lastName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @IsOptional()
  secondLastName: string;

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
  @Matches(/^\d{10}$/)
  phoneNumber: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @IsIn(['OWNER', 'CUSTOMER'])
  role: string;
}
