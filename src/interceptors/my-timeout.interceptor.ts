import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  pipe,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class MyTimeoutInterceptor implements NestInterceptor {
  async intercept(
    // zazwyczaj jest async ale nie musi być
    context: ExecutionContext,
    next: CallHandler, // pozwala zwrócić metodę, która miała się wykonać w naszym kodzie taki GetNameOfNextFunctionWhichYouWillUse() i będzie można coś z nią zrobić
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      // wygląda jak pipe w node.js :)
      timeout(5000), // ustawiamy timeout na 5 sekund
      catchError(err => {
        // łapiemy wszystkie błędy
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException()); // jeżeli błąd jest typu TimeoutError to zwróć wtedy bład RequestTimeoutException - robimy takie rzutowanie błędów trochę błędy z rxjs na http
        }else{
          return throwError(err); // jeżeli nie jest to błąd TimeoutError zwróć to co wyłapie catchError czyli obiekt err i wyswietl zawartość błędu
        }
      }),
    );
  }
}
