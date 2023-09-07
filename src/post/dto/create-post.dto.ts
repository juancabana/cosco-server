import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  tittle: string;

  @IsString()
  @IsAlpha()
  product: string;

  @IsString()
  @IsAlpha()
  departament: string;

  @IsString()
  @IsAlpha()
  city: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stock: number;

  @IsString()
  @IsAlpha()
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
