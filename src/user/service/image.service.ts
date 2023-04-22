import { Injectable } from '@nestjs/common';
// import { sharp } from 'sharp';
const sharp = require('sharp')

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
