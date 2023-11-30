import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopModule } from './shop/shop.module';
import { BasketModule } from './basket/basket.module';
import { CacheModule } from './cache/cache.module';
import { DiscountCodeModule } from './discount-code/discount-code.module';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const ormConfig = require('../ormconfig');

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ShopModule,
    BasketModule,
    CacheModule,
    DiscountCodeModule,
    CronModule,
    MailModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
