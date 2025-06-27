// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Put,
//   Delete,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

// import { CampaignService } from './campaign.service';

// import {
//   CreateCampaignDto,
//   UpdateCampaignDto,
//   ValidateCampaginIdDto,
// } from './../dto/campaign.dto';

// @ApiTags('campaigns')
// @Controller('campaigns')
// export class CampaignsController {
//   constructor(private readonly campaignService: CampaignService) {}

//   @ApiOperation({ summary: 'Get all groups' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return all groups',
//   })
//   @Get()
//   async findAll() {
//     return this.campaignService.findAll();
//   }

//   @ApiOperation({ summary: 'Create a new campaign' })
//   @ApiResponse({
//     status: 201,
//     description: 'The campaign has been successfully created.',
//     type: CreateCampaignDto,
//   })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         name: {
//           type: 'string',
//         },
//         startDate: {
//           type: 'string',
//         },
//       },
//     },
//   })
//   @Post()
//   async create(@Body() createCampaignDto: CreateCampaignDto) {
//     return this.campaignService.create(createCampaignDto);
//   }

//   @ApiOperation({ summary: 'Get a campaign by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return the campaign with the given ID',
//     type: CreateCampaignDto,
//   })
//   @Get(':id')
//   async findOne(@Param() params: ValidateCampaginIdDto) {
//     return this.campaignService.findOne(params);
//   }

//   @ApiOperation({ summary: 'Update a campaign by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'The campaign has been successfully updated.',
//     type: UpdateCampaignDto,
//   })
//   @Put(':id')
//   async update(
//     @Param() params: ValidateCampaginIdDto,
//     @Body() updateCampaignDto: UpdateCampaignDto,
//   ) {
//     return this.campaignService.update(params, updateCampaignDto);
//   }

//   @ApiOperation({ summary: 'Delete a campaign by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'The campaign has been successfully deleted.',
//   })
//   @Delete(':id')
//   async delete(@Param() params: ValidateCampaginIdDto) {
//     return this.campaignService.delete(params);
//   }

//   @ApiOperation({ summary: 'Get the current campaign' })
//   @ApiResponse({
//     status: 200,
//   })
//   @Get('/current/:id')
//   async current(@Param() params: ValidateCampaginIdDto) {
//     return this.campaignService.current(params);
//   }

//   @ApiOperation({ summary: 'List all campaigns by teacher' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return all campaigns for the given teacher',
//     type: [CreateCampaignDto],
//   })
//   @Get('/byteacher/:teacherId')
//   async findByTeacher(@Param('teacherId') teacherId: number) {
//     return this.campaignService.findByTeacher(Number(teacherId));
//   }

//   @ApiOperation({ summary: 'List all campaigns by student' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return all campaigns for the given student',
//     type: [CreateCampaignDto],
//   })
//   @Get('/bystudent/:studentId')
//   async findByStudent(@Param('studentId') studentId: number) {
//     return this.campaignService.findByStudent(Number(studentId));
//   }
// }
