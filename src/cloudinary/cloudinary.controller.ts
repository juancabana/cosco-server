// app.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('image')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // console.log({ fileInController: file });
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    return await this.cloudinaryService.uploadFile(file);
  }
}
