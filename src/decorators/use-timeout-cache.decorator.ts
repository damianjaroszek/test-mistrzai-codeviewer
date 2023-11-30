import { SetMetadata } from '@nestjs/common';

export const UseTimeoutCacheDecorator = (time: number) =>
  SetMetadata('timeToLive', time);
