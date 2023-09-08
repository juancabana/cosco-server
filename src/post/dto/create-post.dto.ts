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
  @IsString()
  @MinLength(1)
  tittle: string;

  @IsString()
  @IsAlpha()
  @MinLength(1)
  product: string;

  @IsString()
  @IsAlpha()
  @MinLength(1)
  departament: string;

  @IsString()
  @IsAlpha()
  @MinLength(1)
  city: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stock: number;

  @IsString()
  @IsAlpha()
  @MinLength(1)
  massUnit: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsString()
  @IsAlpha()
  category: string;

  @IsString()
  description: string;

  image: any;
}
