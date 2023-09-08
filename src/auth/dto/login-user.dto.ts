import {
  IsString,
  IsAlpha,
  MaxLength,
  IsEmail,
  Matches,
  IsOptional,
  IsUrl,
  MinLength,
  IsMongoId,
} from 'class-validator';

export class LoginUserDto {
  @IsMongoId()
  _id: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
