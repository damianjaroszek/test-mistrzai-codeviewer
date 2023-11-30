import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';


@Entity()
export class CacheItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'json', // przy dużej ilości danych można użyć longtext
  })
  data: { avg: number; total: number };
  @Column({
    default: () => 'CURRENT_TIMESTAMP', // dodanie pola timestamp
  })
  createdAt: Date;

  @Column({
    length: 100,
  })
  @Index() // dodanie indeksu do często pobieranego pola celem przyszpieszenia odczytu
  controllerName: string;

  @Column({
    length: 100,
  })
  @Index() // dodanie indeksu do często pobieranego pola celem przyszpieszenia odczytu
  actionName: string;
}






