import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { IUser, anonymousProfileSchema, userSchema } from './user.interface';
import { DomainManager } from '../base/domainManager';
import { z } from 'zod';
import { ISpace } from '../space/space.interface';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class User
  extends BaseDomain<typeof userSchema>
  implements BaseDomain<typeof userSchema>, IUser
{
  private id: T_UUID;
  private email: string;
  private lastName: string;
  private firstName: string;
  private profileImage: string;

  private password?: string;

  private spaceManager: DomainManager<ISpace>;

  constructor(data?: z.input<typeof userSchema>) {
    super(userSchema);
    if (data) this.import(data);
    if (!this.id) this.id = new T_UUID();
  }
  async login(hashedPassword: string): Promise<boolean> {
    if (!this.password)
      throw new InternalServerErrorException('password not set');
    const loginResult = await bcrypt.compare(hashedPassword, this.password);
    if (!loginResult) {
      throw new BadRequestException('login failed');
    }
    return true;
  }

  keepPassword(password: string) {
    if (this.password) throw new BadRequestException('password already set');
    this.password = password;
  }

  popPassword(): string | false {
    if (this.password) {
      const password = this.password;
      this.password = undefined;
      return password;
    }
    return false;
  }

  setProfile(dto: z.infer<typeof userSchema>): boolean {
    if (this.isValid())
      throw new BadRequestException('already user profile set');
    this.import(dto);
    return true;
  }
  getAnonymousProfile(): z.infer<typeof anonymousProfileSchema> {
    return anonymousProfileSchema.parse({});
  }
  getId(): T_UUID {
    return this.id;
  }
  getProfile(requester?: T_UUID) {
    if (requester && requester.isEqual(this.id)) return this.exportJson();
    else return this.exportJsonWithOmitSchema({ email: true });
  }
  updateProfile(
    profile: Partial<z.infer<typeof userSchema>>,
    requester: T_UUID,
  ): boolean {
    if (!requester.isEqual(this.id))
      throw new BadRequestException('Only owner can change profile');
    if (!this.isValid()) throw new BadRequestException('profile not set yet');
    const setResult = this.importPartial(profile);
    if (!setResult) throw new BadRequestException('Profile set failed');
    return setResult;
  }
}
