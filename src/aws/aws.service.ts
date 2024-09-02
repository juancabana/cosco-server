import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async uploadImage(
    base64Image: string,
    key: string,
  ): Promise<S3.ManagedUpload.SendData> {
    if (!base64Image) {
      throw new Error('Image data is required');
    }

    // Extraer el tipo de contenido y los datos base64
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image data');
    }

    const contentType = matches[1];
    const imageData = Buffer.from(matches[2], 'base64');

    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: imageData,
      ContentType: contentType,
    };

    return this.s3.upload(params).promise();
  }
}
