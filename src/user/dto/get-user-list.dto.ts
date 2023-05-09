import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetUserListDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  readonly keyword: string;
}
