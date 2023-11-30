import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  // @Cron('1/15 * * * 1-5') // interwał w zapisie crona co 15 minut od poniedziałku do piątku
  // showSomeInfo() {
  //   console.log('Some important info', new Date());
  // }
}
