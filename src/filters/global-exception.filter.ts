import {
  ArgumentsHost,
  Catch,
  ExceptionFilter, HttpException, HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express'; // ręcznie dodaj ten import, bo sam na to nie wpadnie a będzie walił błędami

@Catch() // pusty parametr - chcemy łapać wszytkie błędy a nie wybrane
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) { // exception: unknown - bo nie wiemy jaki typ błędu przyjdzie do obsługi
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    //const status = exception.getStatus(); // niektóre błędy (poważne deweloperskie) nie posiadają przecież kodów błędu http dlatego użyjemy poniższego zapisu warunkowego
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    // jeżeli exception jest instancją klasy HttpException to pobierz status (bo ma status) a jeżeli nie to wrzuć w status kod 500

    // console.error(exception); // możemy sobie dewelopersko logować błędy w konsoli a użytkownikowi puszczać wersję okrojoną

    response.json({
      status
    });
  }
}



