import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRoleEntity } from './userRole.entity';

@Entity('space')
export class SpaceEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'binary', length: 16, name: 'owner_id' })
  ownerId: Buffer;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.space)
  userRoles: UserRoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
