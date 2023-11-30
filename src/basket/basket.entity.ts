import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemInBasketEntity } from './item-in-basket.entity';

@Entity()
export class BasketEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ItemInBasketEntity, (itemInBasket) => itemInBasket.basket)
  items: ItemInBasketEntity[];
}
