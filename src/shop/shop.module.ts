import { forwardRef, Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { BasketModule } from '../basket/basket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheItemEntity } from '../cache/cache-item.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    forwardRef(() => BasketModule),
    forwardRef(() => MailModule),
    TypeOrmModule.forFeature([CacheItemEntity]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
