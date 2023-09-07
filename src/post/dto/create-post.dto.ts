import {
  IsAlpha,
  IsDate,
  IsMongoId,
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

  @IsNumber()
  @Min(1)
  stock: number;

  @IsString()
  @IsAlpha()
  massUnit: string;

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
}
