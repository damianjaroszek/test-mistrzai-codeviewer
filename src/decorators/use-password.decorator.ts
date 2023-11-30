import { SetMetadata } from '@nestjs/common';

export const UsePassword = (pass: string) =>
  SetMetadata('passwordProtectGoodPassword', pass); //helper umożliwiający przypisanie danych (mapujemy pass z 'passwordProtectGoodPassword') - tą nazwą nie pass posługujemy się w guard
