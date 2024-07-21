import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  tittle: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MinLength(1)
  product: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MinLength(1)
  departament: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
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

  @ApiProperty()
  images: any;
}
