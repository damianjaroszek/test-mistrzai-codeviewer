import { Injectable, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UserEntity } from '../user/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  // FUNKCJA POMOCNICZA
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;

    const accessToken = sign(
      payload,
      'eyw827*&^Niud877ehnuiDYp982-1^dfJBV62^8Hv%fn}0K',
      {
        // tajny klucz ten sam co w jwt strategy -- powinno się go przechowywać w zmiennych środowiskowych
        expiresIn,
      },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  // FUNKCJA POMOCNICZA
  private async generateToken(user: UserEntity): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await UserEntity.findOne({
        where: {
          currentTokenId: token, //nazwaPolaZTokenem
        },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token; //nazwaPolaZTokenem
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    //Promise<LoginResponse>
    try {
      const user = await UserEntity.findOne({
        where: {
          email: req.email,
          pwdHash: hashPwd(req.pwd), // szukamy użytkownika po haśle i hashu
        },
      });

      if (!user) {
        return res.json({ error: 'Invalid login data' }); // jeżeli nie ma użytkownika
      }
      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          // jwt - nazwa ciastka
          secure: false, //trueJeżeliUżywaszHttps,
          domain: 'localhost', //domenaCiastka,
          httpOnly: true, // w przypadku przeglądarki kod frontend nie ma dostępu do ciastka
        })
        .json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}

