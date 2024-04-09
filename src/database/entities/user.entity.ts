import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'binary', length: 16, generated: false })
  id: Buffer;

  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @Column({ type: String, nullable: false, name: 'first_name' })
  firstName: string;

  @Column({ type: String, nullable: false, name: 'last_name' })
  lastName: string;

  @Column({ type: String, nullable: false, name: 'profile_image' })
  profileImage: string;

  @Column({ type: String, nullable: false, select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
