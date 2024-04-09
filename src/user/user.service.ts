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
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/domain/user/user.interface';

@Injectable()
export class UserSerivce implements UserUsecase {
  constructor(
    @Inject('IUserManager')
    private readonly userManager: IUserManager,
    private readonly jwtService: JwtService,
  ) {}
  private getJwtToken(user: IUser) {
    const profile = user.getProfile();

    const accessToken = this.jwtService.sign({
      id: user.getId(),
      email: profile.email,
    });
    const refreshToken = this.jwtService.sign(
      {
        id: user.getId(),
        email: profile.email,
      },
      {
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async loginUser(email: string, password: string): Promise<LoginResult> {
    const user = await this.userManager.getUserForLogin(email);
    user.login(password);
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
  async getUser(id: T_UUID): Promise<IUser | []> {
    const user = await this.userManager.getDomain(id);
    if (user.isValid()) return user;
    return [];
  }
  async createUser(dto: z.infer<typeof createUserDtoSchema>) {
    const user = await this.userManager.createDomain();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    user.keepPassword(hashedPassword);
    user.setProfile(dto);
    await this.userManager.applyDomain(user).then(() => {
      return true;
    });
    return user;
  }
}
