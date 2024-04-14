import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpaceEntity } from './space.entity';
import { SpaceRoleEntity } from './spaceRole.entity';

@Entity('space_entry_code')
export class SpaceEntryCodeEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Index()
  @Column({ type: 'binary', length: 16, name: 'space_id', nullable: true })
  spaceId: Buffer;

  @ManyToOne(() => SpaceEntity)
  @JoinColumn({ name: 'space_id' })
  space: SpaceEntity;

  @Column({ length: 8, unique: true, nullable: false })
  code: string;

  @Column({ type: 'binary', length: 16, name: 'role_id', nullable: true })
  roleId: Buffer;

  @ManyToOne(() => SpaceRoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: SpaceRoleEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
