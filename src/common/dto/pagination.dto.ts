import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class paginationDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  offset?: number;
}
