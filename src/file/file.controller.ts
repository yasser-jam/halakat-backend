// import {
//   Controller,
//   Post,
//   UploadedFile,
//   Body,
//   UseInterceptors,
//   BadRequestException,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import * as path from 'path';
// import * as fs from 'fs';
// import {
//   ApiOperation,
//   ApiResponse,
//   ApiBody,
//   ApiConsumes,
// } from '@nestjs/swagger';
// import { UploadFileDto } from './../dto/file.dto'; // Adjust the path if necessary

// @Controller('upload')
// export class UploadController {
//   @ApiOperation({ summary: 'Upload images' })
//   @ApiResponse({
//     status: 200,
//     description: 'Image successfully uploaded!',
//   })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: 'Image upload data',
//     schema: {
//       type: 'object',
//       properties: {
//         path: {
//           type: 'string',
//           description: 'The name of the folder where the image will be stored',
//           example: 'my-folder',
//         },
//         file: {
//           type: 'string',
//           format: 'binary',
//           description: 'The image file to upload',
//         },
//       },
//     },
//   })
//   @Post('image')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           const folderPath = `./uploads/${req.body.path}`;
//           if (!fs.existsSync(folderPath)) {
//             fs.mkdirSync(folderPath, { recursive: true });
//           }
//           cb(null, folderPath);
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = path.extname(file.originalname);
//           cb(null, `${uniqueSuffix}${ext}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
//           return cb(
//             new BadRequestException('Only image files are allowed!'),
//             false,
//           );
//         }
//         cb(null, true);
//       },
//     }),
//   )
//   async uploadImage(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: UploadFileDto,
//   ) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }

//     return {
//       message: 'File uploaded successfully',
//       filename: file.filename,
//       path: `uploads/${body.path}/${file.filename}`,
//     };
//   }
// }
