

export interface ShopItemInterface {
  id: string;
  name: string;
  description: string;
  price: number;
  // createdAt: Date;
  // boughtCounter: number;
  // wasEverBought: boolean;
}

export type GetListOfProductsResponse = ShopItemInterface[];

export type GetOneProductResponse = ShopItemInterface; // dodanie nowego typu dla zwracanej pojedynczej encji

export type CreateProductResponse = ShopItemInterface; // dodanie nowego typu dla nowo stworzonego produktu

export interface GetPaginatedListOfProductsResponse {
  items: ShopItemInterface[];
  //items: HydratedDocument<ShopItemInterface>[]
  pagesCount: number;
}

export interface StatsData {
  avg: number;
  total: number;
}
