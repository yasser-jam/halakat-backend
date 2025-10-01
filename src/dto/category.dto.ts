import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  organization_id?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  organization_id?: number;
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

