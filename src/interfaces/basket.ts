import { AddProductDto } from '../basket/dto/add-product.dto';

export type AddProductToBasketResponse =
  | {
      isSuccess: true;
      index: number;
    }
  | {
      isSuccess: false;
    };

export interface RemoveProductFromBasketResponse {
  isSuccess: boolean;
}

export type ListProductsInBasketResponse = AddProductDto[];

export type GetTotalPriceResponse =
  | number
  | {
      isSuccess: false;
      alternativeBasket: AddProductDto[];
    };
