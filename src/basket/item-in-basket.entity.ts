import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { ShopItemEntity } from '../shop/shop-item.entity';
import { UserEntity } from '../user/user.entity';
import { BasketEntity } from "./basket.entity";

@Entity()
export class ItemInBasketEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShopItemEntity)
  @JoinColumn()
  shopItem: ShopItemEntity;

  @Column({
    type: 'integer',
    default: 1,
  })
  quantity: number;

  @ManyToOne(() => BasketEntity, (basket) => basket.items)
  basket: BasketEntity;
}
