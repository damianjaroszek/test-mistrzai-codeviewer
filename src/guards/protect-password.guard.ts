import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ProtectPasswordGuard implements CanActivate {

  constructor(
    private reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> {
    // context mamy dostęp do danych, które normalnie mogłyby być przed nami zamaskowane, ExecutioncContext mówi nam dokładnie o tym gdzie jesteśmy. Wcześniej używaliśmy go aby wyciągnąć request context.switchToHttp().getRequest(); a z requesta nagłówki (x-password) teraz użyjemy go do tego aby określić w jakiej metodzie aktualnie jesteśmy (taki getNameOfCurrentFunctionWhichYouUseNow() )
    const goodPass = this.reflector.get<string>('passwordProtectGoodPassword', context.getHandler()); // bo taką unikalną nazwę ustawiliśmy w dekoratorze SetMetadata('passwordProtectGoodPassword', pass);

    const request = context.switchToHttp().getRequest(); // dobranie się do obiektu request z express - aby móc np odczytać nagłówki http
    return request.headers["x-password"] === goodPass; // odczyt nagłówka http o nazwie x-password - jeżeli hasła się zgadzają zwróci true jeżeli nie false
  }
}

