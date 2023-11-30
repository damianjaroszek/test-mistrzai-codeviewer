import { forwardRef, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { AddProductDto } from './dto/add-product.dto';

import { ShopService } from '../shop/shop.service';
import { AddProductToBasketResponse } from '../interfaces/basket';
import { ItemInBasketEntity } from './item-in-basket.entity';
import { BasketEntity } from "./basket.entity";

@Injectable({
  scope: Scope.REQUEST, // teraz za każdym razem, gdy przyjdzie zapytanie będzie tworzona nowa instancja obiektu shop
})
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
    //@Inject(forwardRef(() => BasketEntity)) private basketEntity: BasketEntity,
  ) {}

  async add(item: AddProductDto): Promise<AddProductToBasketResponse> {
    const { productId, count } = item;
    const newItem = await this.shopService.findOne(productId);
    if (!newItem) {
      throw new NotFoundException(`Item with id ${productId} not found`);
    }

    const def = [1,2,3];
    def.map((a) => console.log(a));
    console.log(def);

    // const basket = await this.basketEntity.findOne();
    // if (!basket) {
    //   throw new NotFoundException(`Basket with id ${basket.id} not found`);
    // }
    return { isSuccess: true, index: 1 };
  }
}
