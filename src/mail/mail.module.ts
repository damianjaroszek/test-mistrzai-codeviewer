import { Module } from '@nestjs/common';
import mailerconfig = require('../mailerconfig');
//import { MailerModule } from '@nest-modules/mailer';
//import { MailService } from './mail.service';

@Module({
  //imports: [MailerModule.forRoot(mailerconfig)],
  //providers: [MailService],
  //exports: [MailService], // eksport serwisu MailService - tak żeby inne części aplikacji mogły sobie go importować
})
export class MailModule {}
