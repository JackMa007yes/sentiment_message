import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Client = require('cos-nodejs-sdk-v5');
import COS from 'cos-nodejs-sdk-v5';
import { ConfigService } from '@nestjs/config';

const MESSAGE_IMAGE_KEY_PREFIX = 'chat_images/';
const AVATAR_IMAGE_KEY_PREFIX = 'message_images/';

@Injectable()
export class OSSService {
  private client: COS;
  private bucket: string;
  private region: COS.Region;
  private StorageClass: COS.StorageClass;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get('OSS_BUCKET');
    this.region = this.configService.get('OSS_REGION');
    this.StorageClass = this.configService.get('OSS_STORAGE_CLASS');

    this.client = new Client({
      SecretId: this.configService.get('OSS_SECRET_ID'),
      SecretKey: this.configService.get('OSS_SECRET_KEY'),
    });
  }

  uploadAvatar(file: any, key: string) {
    return this.putObject(file, `${AVATAR_IMAGE_KEY_PREFIX}${key}`);
  }

  uploadMessageImage(file: any, key: string) {
    return this.putObject(file, `${MESSAGE_IMAGE_KEY_PREFIX}${key}`);
  }

  headObject(pathname: string) {
    return new Promise(
      (
        resolve: (value: COS.HeadObjectResult) => void,
        reject: (err: COS.CosSdkError) => void,
      ) => {
        this.client.headObject(
          {
            Bucket: this.bucket,
            Region: this.region,
            Key: this.getKeyFromPathname(pathname),
          },
          (err, data) => {
            err ? reject(err) : resolve(data);
          },
        );
      },
    );
  }

  putObject(file: any, key: string) {
    return new Promise(
      (
        resolve: (value: COS.PutObjectResult) => void,
        reject: (err: COS.CosSdkError) => void,
      ) => {
        this.client.putObject(
          {
            Bucket: this.bucket,
            Region: this.region,
            Key: key,
            StorageClass: this.StorageClass,
            Body: file,
          },
          (err, data) => {
            err ? reject(err) : resolve(data);
          },
        );
      },
    );
  }

  async deleteObject(pathname: string) {
    const fileExist = await this.headObject(pathname);

    if (fileExist) {
      return new Promise(
        (
          resolve: (value: COS.DeleteObjectResult) => void,
          reject: (err: COS.CosSdkError) => void,
        ) => {
          this.client.deleteObject(
            {
              Bucket: this.bucket,
              Region: this.region,
              Key: this.getKeyFromPathname(pathname),
            },
            (err, data) => {
              err ? reject(err) : resolve(data);
            },
          );
        },
      );
    }
  }

  private getKeyFromPathname(pathname: string) {
    const pathTokens = pathname.split('/');
    return pathTokens.slice(2).join('/');
  }
}
