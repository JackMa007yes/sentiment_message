import { SentimentService } from '../common/services/sentiment.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [SentimentService],
  exports: [SentimentService],
})
export class SentimentModule {}
