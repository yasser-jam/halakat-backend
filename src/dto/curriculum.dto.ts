import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateCurriculumDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  organization_id?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  category_ids?: number[];
}

export class UpdateCurriculumDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  organization_id?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  category_ids?: number[];
}

export class CurriculumResponseDto {
  id: number;
  name: string;
  description?: string;
  organization_id?: number;
  created_at: Date;
  updated_at: Date;
  categories?: CategoryResponseDto[];
}

export class CategoryResponseDto {
  id: number;
  name: string;
  description?: string;
  color?: string;
  organization_id?: number;
  created_at: Date;
  updated_at: Date;
}

