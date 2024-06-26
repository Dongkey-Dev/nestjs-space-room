import { Inject, Injectable } from '@nestjs/common';
import {
  LoginResult,
  UserUsecase,
  createUserDtoSchema,
  updateUserDtoSchema,
} from './user.usecase';
import { z } from 'zod';
import { T_UUID } from 'src/util/uuid';
import { IUserManager } from 'src/domain/user/user.manager.interface';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/domain/user/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements UserUsecase {
  constructor(
    @Inject('IUserManager')
    private readonly userManager: IUserManager,
    private readonly jwtService: JwtService,
  ) {}
  private getJwtToken(user: IUser) {
    const accessToken = this.jwtService.sign({
      id: user.getId().exportString(),
    });
    const refreshToken = this.jwtService.sign(
      {
        id: user.getId().exportString(),
      },
      {
        expiresIn: '30d',
      },
    );
    return { accessToken, refreshToken };
  }

  async loginUser(email: string, password: string): Promise<LoginResult> {
    const user = await this.userManager.getUserForLogin(email);
    await user.login(password);
    const { accessToken, refreshToken } = this.getJwtToken(user);
    return { user, accessToken, refreshToken };
  }

  async updateUser(
    id: T_UUID,
    dto: z.infer<typeof updateUserDtoSchema>,
  ): Promise<IUser> {
    const user = await this.userManager.getDomain(id);
    user.updateProfile(dto, id);
    this.userManager.applyDomain(user).then(() => {
      return user;
    });
    return user;
  }
  async getUser(id: T_UUID): Promise<IUser> {
    const user = await this.userManager.getDomain(id);
    if (user.isValid()) return user;
  }
  async createUser(dto: z.infer<typeof createUserDtoSchema>) {
    const [user, salt] = await Promise.all([
      this.userManager.createDomain(),
      bcrypt.genSalt(),
    ]);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    user.keepPassword(hashedPassword);
    user.setProfile(dto);
    await this.userManager.applyDomain(user).then(() => {
      return true;
    });
    return user;
  }
}
