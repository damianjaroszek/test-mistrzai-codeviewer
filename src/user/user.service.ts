import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { RegisterDto } from './dto/register-dto';
import { hashPwd } from '../utils/hash-pwd';
import { RegisterUserResponse } from '../interfaces/user';

@Injectable()
export class UserService {

  filterUser(user: UserEntity): RegisterUserResponse {
    const { id, email } = user;
    return {
      id,
      email,
    };
  }

  async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
    const user = new UserEntity();
    user.email = newUser.email;
    user.pwdHash = hashPwd(newUser.pwd);
    await user.save();

    return this.filterUser(user);
  }
}
