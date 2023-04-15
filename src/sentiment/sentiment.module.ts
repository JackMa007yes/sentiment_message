import { SentimentService } from './sentiment.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [SentimentService],
  exports: [SentimentService],
})
export class SentimentModule {}
