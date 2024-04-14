import { MigrationInterface, QueryRunner } from "typeorm";

export class Second1713120288368 implements MigrationInterface {
    name = 'Second1713120288368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_94cb99035bfeff0567b6ba79fa0\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``);
        await queryRunner.query(`DROP INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_50e005b39f6b523ab70586303e\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP COLUMN \`roleId\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP COLUMN \`spaceId\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`user_id\` \`user_id\` binary(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`space_id\` \`space_id\` binary(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`role_id\` \`role_id\` binary(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_50e005b39f6b523ab70586303ea\` FOREIGN KEY (\`space_id\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_32a6fc2fcb019d8e3a8ace0f55f\` FOREIGN KEY (\`role_id\`) REFERENCES \`space_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_32a6fc2fcb019d8e3a8ace0f55f\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_50e005b39f6b523ab70586303ea\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`role_id\` \`role_id\` binary(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`space_id\` \`space_id\` binary(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`user_id\` \`user_id\` binary(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD \`userId\` binary(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD \`spaceId\` binary(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD \`roleId\` binary(16) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_50e005b39f6b523ab70586303e\` ON \`user_role\` (\`space_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\` (\`role_id\`)`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`space_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_94cb99035bfeff0567b6ba79fa0\` FOREIGN KEY (\`spaceId\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
