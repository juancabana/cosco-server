import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  limit?: number;

  @Type(() => Number)
  offset?: number;
}
