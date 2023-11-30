import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '../user/user.entity';

export interface JwtPayload {
  // interfejs, tu będzie przechowywany token logowania
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null; // jwt - nazwa ciastka
  // funkcja zwraca ciastka, jeżeli istnieje to je zwraca jeżeli nie to null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor, // w jaki sposób pobierać jwt (przy pomocy funkcji powyżej)
      secretOrKey: 'eyw827*&^Niud877ehnuiDYp982-1^dfJBV62^8Hv%fn}0K', // sam klient nie będzie się mógł do niego dostać
    });
  }

  // sprawdzamy czy to co mamy w JWT faktycznie odpowiada jakiemuś użytkownikowi
  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) { // sprawdzamy czy istnieje payload a jeżeli istnieje to czy ma id
      return done(new UnauthorizedException(), false); // jeżeli brak --> nieautoryzowany
    }

    const user = await UserEntity.findOne({
      where: {
        currentTokenId: payload.id, // wyszukujemy usera po tokenie
      },
    });

    if (!user) {
      return done(new UnauthorizedException(), false); // jeżeli brak usera z tokenem --> nieautoryzowany
    }
    done(null, user); // --> ok i zwracamy usera
  }
}
