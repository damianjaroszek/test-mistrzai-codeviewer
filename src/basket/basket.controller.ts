import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import { BasketService } from './basket.service';

import { ShopService } from '../shop/shop.service';
import { AddProductToBasketResponse } from '../interfaces/basket';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService: BasketService) {}

  // @Get('/')
  // listProductsInBasket():ListProductsInBasketResponse {
  //     return this.basketService.list();
  // }
  //
  // @Get('/total-price')
  // getTotalPrice(): Promise<GetTotalPriceResponse>{
  //     return this.basketService.getTotalPrice();
  // }
  //
  @Post('/')
  AddProductToBasket(
      @Body() item: AddProductDto
  ): Promise<AddProductToBasketResponse> {
    return this.basketService.add(item);
  }
  //
  // @Delete('/:index')
  // removeProductFromBasket(
  //     @Param('index') index: string,
  // ): RemoveProductFromBasketResponse{
  //     return this.basketService.remove(Number(index));
  // }
}
