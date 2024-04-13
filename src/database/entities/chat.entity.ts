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
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity('chat')
export class ChatEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Column({ type: 'binary', length: 16, name: 'post_id' })
  postId: Buffer;

  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @Column({ type: 'binary', length: 16, name: 'author_id' })
  authorId: Buffer;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ type: 'binary', length: 16, nullable: true, name: 'parent_id' })
  parentId: Buffer;

  @Column({ name: 'is_anonymous' })
  isAnonymous: boolean;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
