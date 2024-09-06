import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MinLength(1)
  product: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/, {
    message: 'City must contain only letters (a-zA-Z) and Spanish characters',
  })
  @MinLength(1)
  department: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/, {
    message: 'City must contain only letters (a-zA-Z) and Spanish characters',
  })
  @MinLength(1)
  city: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stock: number;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MinLength(1)
  massUnit: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  category: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
