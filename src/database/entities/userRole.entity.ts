import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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

  @Index()
  @Column({ type: 'binary', length: 16, name: 'user_id' })
  userId: Buffer;

  @ManyToOne(() => UserEntity, { nullable: false })
  user: UserEntity;

  @Index()
  @Column({ type: 'binary', length: 16, name: 'space_id' })
  spaceId: Buffer;

  @ManyToOne(() => SpaceEntity, (space) => space.id)
  space: SpaceEntity;

  @Index()
  @Column({ type: 'binary', length: 16, name: 'role_id' })
  roleId: Buffer;

  @ManyToOne(() => SpaceRoleEntity, { nullable: true })
  role: SpaceRoleEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
