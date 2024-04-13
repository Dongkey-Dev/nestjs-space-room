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

@Entity('space_role')
export class SpaceRoleEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Index()
  @Column({ type: 'binary', length: 16, name: 'space_id' })
  spaceId: Buffer;

  @ManyToOne(() => SpaceEntity, { nullable: false })
  @JoinColumn({ name: 'space_id' })
  space: SpaceEntity;

  @Column()
  name: string;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
