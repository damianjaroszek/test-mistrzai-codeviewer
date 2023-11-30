import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemInterface } from '../interfaces/shop';
import { ItemInBasketEntity } from '../basket/item-in-basket.entity';

@Entity()
export class ShopItemEntity extends BaseEntity implements ShopItemInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 1000,
  })
  description: string;

  @Column({
    type: 'float',
    precision: 7,
    scale: 2,
  })
  price: number;

  @Column({
    default: null,
    nullable: true,
  })
  photoFn: string;

  // @ManyToMany((type) => ItemInBasketEntity, (entity) => entity.items)
  // itemsInBasketEntity: ItemInBasketEntity[];

  // @OneToMany(ItemInBasketEntity, entity => entity.shopItemEntity)
  //   itemsInBasketEntity: ItemInBasketEntity[];
  //
}
