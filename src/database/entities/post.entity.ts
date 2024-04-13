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
import { UserEntity } from './user.entity';

@Entity('post')
export class PostEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Index()
  @Column({ type: 'binary', length: 16, name: 'space_id' })
  spaceId: Buffer;

  @ManyToOne(() => SpaceEntity, { nullable: false })
  @JoinColumn({ name: 'space_id' })
  space: SpaceEntity;

  @Column({ type: 'binary', length: 16, name: 'author_id' })
  authorId: Buffer;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ name: 'is_anonymous' })
  isAnonymous: boolean;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
