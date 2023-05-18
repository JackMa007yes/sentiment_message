import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentiment = require('sentiment');

@Injectable()
export class SentimentService {
  private sentimentUtil;
  constructor() {
    this.sentimentUtil = new Sentiment();
  }

  analyze(message: string) {
    return this.sentimentUtil.analyze(message).score;
  }
}
