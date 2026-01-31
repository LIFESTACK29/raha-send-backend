import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get<string>('SCALEWAY_REGION') as string,
      endpoint: this.configService.get<string>('SCALEWAY_ENDPOINT') as string,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'SCALEWAY_ACCESS_KEY',
        ) as string,
        secretAccessKey: this.configService.get<string>(
          'SCALEWAY_SECRET_KEY',
        ) as string,
      },
      forcePathStyle: true,
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;
    const bucketName = this.configService.get<string>('SCALEWAY_BUCKET_NAME');
    if (!bucketName) {
      throw new BadRequestException('Storage bucket not configured');
    }

    try {
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      const params = {
        Bucket: bucketName,
        Key: filePath,
        Body: bufferStream,
        ContentType: file.mimetype,
        ACL: 'public-read' as const,
      };
      const upload = new Upload({ params, client: this.client });
      await upload.done();

      // Return the file URL
      // Note: Check if the region is part of the URL domain for your specific Scaleway setup
      return `https://${bucketName}.s3.${this.configService.get<string>('SCALEWAY_REGION')}.scw.cloud/${filePath}`;
    } catch (error) {
      console.error('Error uploading file to Scaleway:', error);
      throw new BadRequestException('Failed to upload file to storage');
    }
  }

  private fileFilter(req: any, file: Express.Multer.File, cb: any) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPEG, PNG, and PDF files are allowed.',
        ),
      );
    }
  }
}
