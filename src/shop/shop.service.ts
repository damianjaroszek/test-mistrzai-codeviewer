import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BasketService } from '../basket/basket.service';
import { ShopItemInterface, StatsData } from '../interfaces/shop';
//import { MailService } from '../mail/mail.service';
import { salesRaportEmailTemplate } from '../templates/email/sales-raport';
import { AddProductDto } from './dto/add-product.dto';
import { MulterDiskUploadedFiles } from '../interfaces/files';
import { ShopItemEntity } from './shop-item.entity';
import * as path from 'path';
import { storageDir } from '../utils/storage';
import { unlink } from 'fs/promises';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService, //@Inject(forwardRef(() => MailService)) private mailService: MailService,
  ) {}

  filter(shopItem: ShopItemEntity): ShopItemInterface {
    // funkcja odfiltrowująca wrażliwe dane
    const { id, price, description, name } = shopItem; // nie daję fotoFn!!!!!!
    return { id, price, description, name };
  }

  async getItems(): Promise<ShopItemInterface[]> {
    return (await ShopItemEntity.find()).map(this.filter);
  }

  async findOne(itemId): Promise<ShopItemInterface> {
    return await ShopItemEntity.findOne({ where: { id: itemId } });
  }

  async getStatsForAdmin(): Promise<StatsData> {
    // wywołana przy GET: http://localhost:3000/shop/admin-stats
    const avg = Math.round(Math.random() * 100);
    const total = Math.round(Math.random() * 100);
    /*await this.mailService.sendMail(
      // wyślij email
      'testowyuser@1234.pl',
      'raport sprzedaży',
      salesRaportEmailTemplate(total, avg), //  zamiast w argumencie funkcji odpowiedzialnej za przyjęcie html rozpisywać się znacznikami wygodniej jest posłużyć się funkcją, która buduje HTML i nawet można do niej przekazać wartości
    );*/
    return { avg, total };
  }

  async getStatsHundred(): Promise<StatsData> {
    const avg = Math.round(Math.random() * 1000);
    const total = Math.round(Math.random() * 1000);
    return { avg, total };
  }

  async addProduct(
    req: AddProductDto,
    files: MulterDiskUploadedFiles,
  ): Promise<ShopItemInterface> {
    const photo = files?.photo?.[0] ?? null;

    try {
      console.log({ req });
      console.log({ photo });
      const { name, description, price } = req;

      const shopItem = new ShopItemEntity();
      shopItem.name = name;
      shopItem.description = description;
      shopItem.price = price;

      //throw new Error('Oh noes!'); // symulujemy, że coś poszło nie tak na siłę "wciskamy" błąd

      if (photo) {
        // jeżeli zdjęcie zostało załączone - nie musiało
        shopItem.photoFn = photo.filename;
      }

      const addedItem = await shopItem.save();

      return this.filter(addedItem); // tutaj też odsyłamy tylko niezbędne, bezpieczne dane bez ścieżek
    } catch (e) {
      try {
        if (photo) {
          // usuń plik jeżeli photo zostało przesłane
          await unlink(
            path.join(storageDir(), 'product-photos', photo.filename),
          );
        }
      } catch (e2) {} // nie zepsuje programu gdy na przykład coś pójdzie nie tak podczas usuwania
      throw e; // wyrzucanie błędu to dla nas cenna informacja - może błędna jest walidacja albo mamy jakiś błąd w programie
    }
  }

  async getPhoto(id: string, res: any) {
    try {
      const one = await ShopItemEntity.findOneBy({ id }); // szukamy elementu w bazie po ID
      if (!one) {
        // jeżeli nie ma elementu rzuć błąd
        throw new Error('No object found!');
      }
      if (!one.photoFn) {
        // jezeli odwołamy się do encji, która nie ma nazwy pliku
        throw new Error('No photo in this entity!');
      }
      res.sendFile(one.photoFn, {
        // podajemy nazwę pliku, następnie w obiekcie przekazujemy ścieżkę, w której znajduje się plik
        root: path.join(storageDir(), 'product-photos/'),
      });
    } catch (e) {
      //res.json(errorToApiErrorMessage(e)); - można odsyłać np JSON z errorem
      res.json({
        error: e.message, // jak coś pojdzie nie tak
      });
    }
  }
}
