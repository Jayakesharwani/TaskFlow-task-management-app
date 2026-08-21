import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  v2 as cloudinary,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly configService: ConfigService,
  ) {
    const cloudName =
      this.configService.get<string>(
        'CLOUDINARY_CLOUD_NAME',
      );

    const apiKey =
      this.configService.get<string>(
        'CLOUDINARY_API_KEY',
      );

    const apiSecret =
      this.configService.get<string>(
        'CLOUDINARY_API_SECRET',
      );

    if (!cloudName || !apiKey || !apiSecret) {
      console.error(
        'Cloudinary configuration is missing.',
      );

      console.error({
        CLOUDINARY_CLOUD_NAME: !!cloudName,
        CLOUDINARY_API_KEY: !!apiKey,
        CLOUDINARY_API_SECRET: !!apiSecret,
      });

      throw new Error(
        'Cloudinary environment variables are not configured correctly.',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log(
      'Cloudinary configured successfully:',
      cloudName,
    );
  }

  // =====================================================
  // UPLOAD FILE
  // =====================================================

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new InternalServerErrorException(
        'No file received for Cloudinary upload',
      );
    }

    if (!file.buffer) {
      throw new InternalServerErrorException(
        'File buffer is missing',
      );
    }

    console.log(
      'Uploading file to Cloudinary:',
      file.originalname,
    );

    return new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: 'taskflow',
              resource_type: 'auto',
            },

            (error, result) => {
              if (error) {
                console.error(
                  '========== CLOUDINARY ERROR ==========',
                );

                console.error(error);

                console.error(
                  '=======================================',
                );

                reject(error);
                return;
              }

              if (!result) {
                const uploadError =
                  new Error(
                    'Cloudinary upload returned no result',
                  );

                console.error(uploadError);

                reject(uploadError);
                return;
              }

              console.log(
                'Cloudinary upload successful:',
                {
                  publicId: result.public_id,
                  secureUrl: result.secure_url,
                  resourceType:
                    result.resource_type,
                },
              );

              resolve(result);
            },
          );

        uploadStream.end(file.buffer);
      },
    );
  }

  // =====================================================
  // DELETE FILE
  // =====================================================

  async deleteFile(
    publicId: string,
  ): Promise<void> {
    if (!publicId) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: 'image',
        },
      );

      console.log(
        'Cloudinary file deleted:',
        publicId,
      );
    } catch (error) {
      console.error(
        'Failed to delete Cloudinary file:',
        error,
      );
    }
  }
}