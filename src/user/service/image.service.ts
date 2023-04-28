import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

@Injectable()
export class ImageService {
  private readonly sharp;
  constructor() {
    this.sharp = sharp;
  }

  async compression(buffer: any, x?: number, y?: number) {
    const output = await sharp(buffer)
      .resize(x, y, { fit: 'inside' })
      .png({ quality: 6 })
      .toBuffer();

    return output;
  }
}
