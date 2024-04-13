import { MigrationInterface, QueryRunner } from 'typeorm';

export class SecondCreateTable1712985504789 implements MigrationInterface {
  name = 'SecondCreateTable1712985504789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`space\` (\`id\` binary(16) NOT NULL, \`name\` varchar(255) NOT NULL, \`logo\` varchar(255) NULL, \`owner_id\` binary(16) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`space_role\` (\`id\` binary(16) NOT NULL, \`space_id\` binary(16) NOT NULL, \`name\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_96c8132731549e9a7e57a6165f\` (\`space_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`id\` binary(16) NOT NULL, \`user_id\` binary(16) NOT NULL, \`space_id\` binary(16) NOT NULL, \`role_id\` binary(16) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` binary(16) NOT NULL, \`spaceId\` binary(16) NULL, \`roleId\` binary(16) NULL, INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` (\`user_id\`), INDEX \`IDX_50e005b39f6b523ab70586303e\` (\`space_id\`), INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` (\`role_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` binary(16) NOT NULL, \`space_id\` binary(16) NOT NULL, \`author_id\` binary(16) NOT NULL, \`is_anonymous\` tinyint NOT NULL, \`type\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_4873b2ec27a93cd3f2518cb181\` (\`space_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat\` (\`id\` binary(16) NOT NULL, \`post_id\` binary(16) NOT NULL, \`author_id\` binary(16) NOT NULL, \`parent_id\` binary(16) NULL, \`is_anonymous\` tinyint NOT NULL, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`space\` ADD CONSTRAINT \`FK_9114b5dd2c691b98d7fa3f10b21\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`space_role\` ADD CONSTRAINT \`FK_96c8132731549e9a7e57a6165f9\` FOREIGN KEY (\`space_id\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_94cb99035bfeff0567b6ba79fa0\` FOREIGN KEY (\`spaceId\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`space_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_4873b2ec27a93cd3f2518cb1813\` FOREIGN KEY (\`space_id\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_2f1a9ca8908fc8168bc18437f62\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_4af4b7ce6939f782093abb178d5\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_41e09a2d259a65bd784cd9bb566\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_41e09a2d259a65bd784cd9bb566\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_4af4b7ce6939f782093abb178d5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_2f1a9ca8908fc8168bc18437f62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_4873b2ec27a93cd3f2518cb1813\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_94cb99035bfeff0567b6ba79fa0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`space_role\` DROP FOREIGN KEY \`FK_96c8132731549e9a7e57a6165f9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`space\` DROP FOREIGN KEY \`FK_9114b5dd2c691b98d7fa3f10b21\``,
    );
    await queryRunner.query(`DROP TABLE \`chat\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4873b2ec27a93cd3f2518cb181\` ON \`post\``,
    );
    await queryRunner.query(`DROP TABLE \`post\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_50e005b39f6b523ab70586303e\` ON \`user_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``,
    );
    await queryRunner.query(`DROP TABLE \`user_role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_96c8132731549e9a7e57a6165f\` ON \`space_role\``,
    );
    await queryRunner.query(`DROP TABLE \`space_role\``);
    await queryRunner.query(`DROP TABLE \`space\``);
  }
}
