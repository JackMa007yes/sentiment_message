import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // 将传入值解析为数字
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  offset: number;
}
