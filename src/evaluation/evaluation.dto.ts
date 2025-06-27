// import { ApiProperty } from '@nestjs/swagger';
// import { IsInt, IsNotEmpty, Min } from 'class-validator';

// export class CreateEvaluationDto {
//   @ApiProperty({ example: 'جيد جداً' })
//   @IsNotEmpty()
//   title: string;

//   @ApiProperty({ example: 90 })
//   @IsInt()
//   points: number;

//   @ApiProperty({
//     example: 3,
//     description: 'Max reduced points to get this evaluation',
//   })
//   @IsInt()
//   @Min(0)
//   reducedAmount: number;

//   @ApiProperty({ example: 1 })
//   @IsInt()
//   campaignId: number;
// }
