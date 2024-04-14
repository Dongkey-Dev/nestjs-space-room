import { z } from 'zod';
import { ISpace } from '../space/space.interface';
import { ISpaceRole, permissionEnum } from './spaceRole.interface';
import { T_UUID } from 'src/util/uuid';

export const createRolesSchema = z
  .object({
    name: z.string(),
    permission: permissionEnum,
  })
  .array();

export interface ISpaceRoleManager {
  createRole(
    spaceId: T_UUID,
    roleName: string,
    permission: z.infer<typeof permissionEnum>,
  ): ISpaceRole;
  applyRole(role: ISpaceRole): Promise<boolean>;
  // getRole(user: IUser): Promise<ISpaceRole>;

  getRolesBySpace(space: ISpace): Promise<ISpaceRole[]>;
  createRoles(roles: ISpaceRole[]): Promise<boolean>;
}
