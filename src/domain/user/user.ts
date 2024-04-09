import { T_UUID } from 'src/util/uuid';
import { BaseDomain } from '../base/baseDomain';
import { IUser, anonymousProfileSchema, userSchema } from './user.interface';
import { DomainManager } from '../base/domainManager';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import { ISpace } from '../space/space.interface';

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
  login(password: string): boolean {
    if (this.isValid() && bcrypt.compare(password, this.popPassword())) {
      return true;
    }
    throw new Error('login failed');
  }
  keepPassword(password: string) {
    if (this.password) throw new Error('password already set');
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
    if (this.isValid()) throw new Error('already user profile set');
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
    if (requester && requester === this.id) return this.exportJson();
    else return this.exportJsonWithOmitSchema({ email: true });
  }
  updateProfile(
    profile: Partial<z.infer<typeof userSchema>>,
    requester: T_UUID,
  ): boolean {
    if (!requester.isEqual(this.id))
      throw new Error('Only owner can change profile');
    if (!this.isValid()) throw new Error('profile not set yet');
    const setResult = this.importPartial(profile);
    if (!setResult) throw new Error('Profile set failed');
    return setResult;
  }
}