import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    required: false,
    description: 'The name of the folder where the image will be stored',
    example: 'my-folder',
  })
  @IsString()
  path: string;
}
