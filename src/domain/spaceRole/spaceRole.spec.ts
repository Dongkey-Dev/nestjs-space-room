import { T_UUID } from 'src/util/uuid';
import { SpaceRole } from './spaceRole';

describe('SpaceRole', () => {
  let spaceRole: SpaceRole;
  const permission = 'admin';
  const roleName = 'admin';
  beforeEach(() => {
    spaceRole = new SpaceRole({
      id: new T_UUID(),
      spaceId: new T_UUID(),
      roleName: roleName,
      permission: permission,
    });
  });

  it('생성 확인', () => {
    expect(spaceRole).toBeTruthy();
  });

  it('역할 설정 확인', () => {
    expect(spaceRole.getRole()).toEqual(roleName);
  });

  it('권한 설정 확인', () => {
    expect(spaceRole.getPermission()).toEqual(permission);
  });
});
