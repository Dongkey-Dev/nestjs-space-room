import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SpaceEntity } from './space.entity';
import { SpaceRoleEntity } from './spaceRole.entity';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Column({ name: 'user_id', type: 'binary', length: 16 })
  userId: Buffer;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'space_id', type: 'binary', length: 16 })
  spaceId: Buffer;

  @ManyToOne(() => SpaceEntity, (space) => space.userRoles)
  @JoinColumn({ name: 'space_id' })
  space: SpaceEntity;

  @Column({ name: 'role_id', type: 'binary', length: 16, nullable: true })
  roleId: Buffer;

  @ManyToOne(() => SpaceRoleEntity, (role) => role.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: SpaceRoleEntity | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
