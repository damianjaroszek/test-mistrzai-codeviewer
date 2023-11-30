import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CacheItemEntity } from '../cache/cache-item.entity';
import { NestExpressApplication } from "@nestjs/platform-express";

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler(); // dostajemy się do oryginalnej metody - getNameOfMethodWhichYouUse() - czyli:
    //const cachedData = this.reflector.get<any>('cacheData', method); // method = context.getHandler(); - dodstajemy się do funkcji kontrolera odczyt metadanych ustawionych przez reflektor w tej funkcji
    //const cachedTime = this.reflector.get<Date>('cacheTime', method); // method = context.getHandler(); - dodstajemy się do funkcji kontrolera odczyt metadanych ustawionych przez reflektor w tej funkcji
    const controllerName = context.getClass().name;
    const actionName = context.getHandler().name;

    const cacheTimeInMiliSec = this.reflector.get<number>('timeToLive', method); // method = context.getHandler(); - dodstajemy się do funkcji kontrolera odczyt metadanych ustawionych przez dekorator set-timeout.decorator.ts
    /*
  Po stronie kontolera (shop.controller.ts) - zadeklarowaliśmy użycie interceptora MyCacheInterceptor na ścieżce '/admin-stats', która wywołuje funkcję getStats() to użycie  context.getHandler() sprawi, że dostajemy się do getStats(), zatem method = getStats(). Oczywiście wszystko dzieje się dynamicznie więc pobieramy funkcję przy użyciu contextu, co sprawia, że interceptor jest reużywalny
  @Get('/admin-stats')
  @UseInterceptors(MyCacheInterceptor)
  getStats() {
    return this.shopService.getStatsForAdmin();
  }*/

    const cachedData = await CacheItemEntity.findOne({
      where: {
        controllerName,
        actionName,
      },
    });

    if (cachedData) {
      if (+cachedData.createdAt + cacheTimeInMiliSec > +new Date()) { // + konwersja daty na milisekundy od 01.01.1970 czas UNIXowy
        console.log('using cached data: ', cachedData); // jeżeli dane mieszczą się w terminie przydatności czas wrzucenia do bazy + 10 sekund (deklarowane w dekoratorze) to podaj dane z cache
        return of(cachedData.data); // gdybyśmy użyli longtext zamiast json w encji JSON.parse(cachedData.data)
      } else {
        console.log('Removing old cache data', cachedData.id); // jeżeli dane nie są w terminie przydatnosci czas wrzucenia do bazy + 10 sekund (deklarowane w dekoratorze) to usuń dane z bazy - wyczyść cache a w tap przechwyć świeże dane zwrócone z funkcji
        await cachedData.remove();
      }
    }

    return next.handle().pipe(
      tap(
        //tap bo chcemy wziąć świeże dane zwracane przez funkcję kontrolera ale nic w nich nie modyfikować tylko zapisać do cache
        async (data) => {
          console.log('using live data from function: ', data);
          console.log(controllerName, actionName);

          const dataToSaveInDb = new CacheItemEntity();
          // gdybyśmy w bazie nie korzystali z JSONa to przed zapisem do bazy trzeba go sparsować z obiektu do stringa czyli
          // dataToSaveInDb.data = JSON.stringify(data);
          dataToSaveInDb.data = data;
          dataToSaveInDb.controllerName = controllerName;
          dataToSaveInDb.actionName = actionName;
          await dataToSaveInDb.save();
           // wykorzystujemy świeżo zwrócone dane z funkcji i zapisujemy je do bufora
          // Reflect.defineMetadata('cacheData', data, method); // zapisujemy dane do method = context.getHandler(); - czyli funkcji kontrolera
          Reflect.defineMetadata('cacheTime', new Date(), method); // przypisujemy czas generowania danych do method = context.getHandler(); - czyli funkcji kontrolera - konktetnie do funkcji, w której użyto my-cache.interceptor.ts
        },
      ),
    );
  }
}

