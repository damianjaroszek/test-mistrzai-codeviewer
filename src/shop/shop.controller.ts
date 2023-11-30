import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { MyTimeoutInterceptor } from '../interceptors/my-timeout.interceptor';
import { MyCacheInterceptor } from '../interceptors/my-cache.interceptor';
import { UseTimeoutCacheDecorator } from '../decorators/use-timeout-cache.decorator';
import { AddProductDto } from './dto/add-product.dto';
import { ShopItemInterface } from '../interfaces/shop';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, storageDir } from '../utils/storage';
import * as path from 'path';
import { MulterDiskUploadedFiles } from '../interfaces/files';

@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/admin-stats')
  //@UseGuards(ProtectPasswordGuard)
  //@UsePassword('admin1') // użycie dekoratora metadanych, który przekaże password do guarda (ProtectPasswordGuard)
  //@UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
  //@UseTimeoutCacheDecorator(10000)
  getStats() {
    return this.shopService.getStatsForAdmin();
    //return new Promise((resolve) => {}); // ustawienie niekończącego się pustego promise sprawi, że funkcja się zawiesi (timeout)
  }

  @Get('/admin-stats-hundred')
  @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
  @UseTimeoutCacheDecorator(10000)
  getStatsHundred() {
    return this.shopService.getStatsHundred();
    //return new Promise((resolve) => {}); // ustawienie niekończącego się pustego promise sprawi, że funkcja się zawiesi (timeout)
  }

  @Post('/')
  @UseInterceptors(
    // aby przyjmować dane z multipartform należy skorzystać z inceptora FileFieldsInceptor
    FileFieldsInterceptor(
      [
        {
          name: 'photo',
          maxCount: 1,
        },
      ],
      {
        storage: multerStorage(path.join(storageDir(), 'product-photos')), // towrzymy zapis z dodaniem odpowiedniego rozszerzenia na podstawie mime - własna funkcja multerStorage
      },
    ),
  )
  addProduct(
    @Body() req: AddProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles, // bez tego przesyłając plik w formularzu on się wyśle w wskazane miejsce jednak będzie bez rozszerzenia i zgubi swoją nazwę
  ): Promise<ShopItemInterface> {
    return this.shopService.addProduct(req, files);
  }

  @Get('photo/:id')
  async getImage(@Param('id') id: string, @Res() res: any): Promise<any> {
    return this.shopService.getPhoto(id, res);
  }

  @Get('find/:id')
  async findOneItem(@Param('id') id: string): Promise<ShopItemInterface> {
    return this.shopService.findOne(id);
  }
}
