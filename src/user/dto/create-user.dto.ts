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
  @Matches(/^[a-zA-Z]+$/, {
    message: 'firstName must contain only letters (a-zA-Z)',
  })
  @MaxLength(15)
  @MinLength(1)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @IsOptional()
  @Matches(/^[a-zA-Z]*$/, {
    message: 'secondName must contain only letters (a-zA-Z)',
  })
  secondName: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MaxLength(15)
  @MinLength(1)
  lastName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @IsOptional()
  @Matches(/^[a-zA-Z]*$/, {
    message: 'secondLastName must contain only letters (a-zA-Z)',
  })
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

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsUrl()
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
