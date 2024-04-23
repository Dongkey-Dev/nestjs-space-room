import { DataSource } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Space } from '../domain/space/space';
import { SpaceRole } from '../domain/spaceRole/spaceRole';
import { User } from '../domain/user/user';
import { UserRoleEntity } from '../database/entities/userRole.entity';
import { UserEntity } from '../database/entities/user.entity';
import { T_UUID } from '../util/uuid';
import { SpaceEntity } from '../database/entities/space.entity';
import { SpaceRoleEntity } from '../database/entities/spaceRole.entity';

class JoinRepo {
  dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async start(userList: T_UUID[]) {
    const res = [];
    for (const user of userList) {
      res.push(await this.getUserRole(user));
    }
    return res;
  }

  async getUsers(count: number) {
    const userEntityList = await this.dataSource
      .getRepository(UserRoleEntity)
      .find({ take: count });
    const userList = userEntityList.map((entity) => {
      return new T_UUID(entity.userId);
    });
    return userList;
  }

  async getUserRole(userId: T_UUID) {
    const userMemberEntity = await this.dataSource
      .getRepository(UserRoleEntity)
      .findOne({
        where: { userId: userId.exportBuffer() },
        relations: ['role', 'user', 'space'],
      });
    const user = this.userEntityToDomain(userMemberEntity.user);
    const space = this.spaceEntityToDomain(userMemberEntity.space);
    const role = this.roleEntityToDomain(userMemberEntity.role);

    return { user, space, role };
  }

  private userEntityToDomain(entity: UserEntity) {
    return new User(entity);
  }

  private spaceEntityToDomain(entity: SpaceEntity) {
    return new Space({
      id: new T_UUID(entity.id),
      name: entity.name,
      logo: entity.logo,
      ownerId: new T_UUID(entity.ownerId),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private roleEntityToDomain(entity: SpaceRoleEntity) {
    return new SpaceRole({
      id: new T_UUID(entity.id),
      spaceId: new T_UUID(entity.spaceId),
      roleName: entity.name,
      permission: entity.isAdmin ? 'admin' : 'member',
    });
  }
}

class PromiseAllRepo {
  dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async start(userList: T_UUID[]) {
    const res = [];
    for (const user of userList) {
      res.push(await this.getUserRole(user));
    }
    return res;
  }

  async get100Users(count: number) {
    const userEntityList = await this.dataSource
      .getRepository(UserRoleEntity)
      .find({ take: count });
    const userList = userEntityList.map((entity) => {
      return new T_UUID(entity.userId);
    });
    return userList;
  }

  async getUserRole(userId: T_UUID) {
    const userMemberEntity = await this.dataSource
      .getRepository(UserRoleEntity)
      .findOne({
        where: { userId: userId.exportBuffer() },
      });

    const prm1 = this.getUser(new T_UUID(userMemberEntity.userId));
    const prm2 = this.getSpace(new T_UUID(userMemberEntity.spaceId));
    const prm3 = this.getRole(new T_UUID(userMemberEntity.roleId));

    const [user, space, role] = await Promise.all([prm1, prm2, prm3]);
    return { user, space, role };
  }

  async getSpace(spaceId: T_UUID) {
    const spaceEntity = await this.dataSource
      .getRepository(SpaceEntity)
      .findOne({
        where: { id: spaceId.exportBuffer() },
      });
    return this.spaceEntityToDomain(spaceEntity);
  }

  async getRole(roleId: T_UUID) {
    const roleEntity = await this.dataSource
      .getRepository(SpaceRoleEntity)
      .findOne({
        where: { id: roleId.exportBuffer() },
      });
    return this.roleEntityToDomain(roleEntity);
  }
  async getUser(userId: T_UUID) {
    const userEntity = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: userId.exportBuffer() },
    });
    return this.userEntityToDomain(userEntity);
  }

  private userEntityToDomain(entity: UserEntity) {
    return new User(entity);
  }

  private spaceEntityToDomain(entity: SpaceEntity) {
    return new Space({
      id: new T_UUID(entity.id),
      name: entity.name,
      logo: entity.logo,
      ownerId: new T_UUID(entity.ownerId),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private roleEntityToDomain(entity: SpaceRoleEntity) {
    return new SpaceRole({
      id: new T_UUID(entity.id),
      spaceId: new T_UUID(entity.spaceId),
      roleName: entity.name,
      permission: entity.isAdmin ? 'admin' : 'member',
    });
  }
}

describe('test', () => {
  let datasource: DataSource;
  let joinRepo: JoinRepo;
  let promiseAllRepo: PromiseAllRepo;

  beforeAll(async () => {
    datasource = AppDataSource;
    await datasource.initialize();
    joinRepo = new JoinRepo(datasource);
    promiseAllRepo = new PromiseAllRepo(datasource);
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  it('should be defined', () => {
    expect(datasource).toBeDefined();
  });

  it('should get 100 users', async () => {
    const users = await joinRepo.getUsers(100);
    expect(users.length).toBe(100);
  });

  it('START TEST JOIN REPO', async () => {
    const count = 1;
    const userIdList = await joinRepo.getUsers(count);
    console.time('joinRepo.start');
    const res = await joinRepo.start(userIdList);
    console.timeEnd('joinRepo.start');
    expect(res.length).toBe(count);
  }, 100000); // Increase the timeout value to 10000ms

  it('START TEST PROMISE ALL REPO', async () => {
    const count = 1;
    const users = await promiseAllRepo.get100Users(count);
    console.time('promiseAllRepo.start');
    const res = await promiseAllRepo.start(users);
    console.timeEnd('promiseAllRepo.start');
    expect(res.length).toBe(count);
  }, 100000);
});
