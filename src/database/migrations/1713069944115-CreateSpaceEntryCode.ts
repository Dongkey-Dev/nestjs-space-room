import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpaceEntryCode1713069944115 implements MigrationInterface {
    name = 'CreateSpaceEntryCode1713069944115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`space_entry_code\` (\`id\` binary(16) NOT NULL, \`space_id\` binary(16) NULL, \`code\` varchar(8) NOT NULL, \`role_id\` binary(16) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_4346e837d27a429e70f1b0bc4d\` (\`space_id\`), UNIQUE INDEX \`IDX_b01ac273028eb443cb7f9a78b6\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`space_entry_code\` ADD CONSTRAINT \`FK_4346e837d27a429e70f1b0bc4dd\` FOREIGN KEY (\`space_id\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`space_entry_code\` ADD CONSTRAINT \`FK_f6e22119e4c88af2b7ac8111522\` FOREIGN KEY (\`role_id\`) REFERENCES \`space_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`space_entry_code\` DROP FOREIGN KEY \`FK_f6e22119e4c88af2b7ac8111522\``);
        await queryRunner.query(`ALTER TABLE \`space_entry_code\` DROP FOREIGN KEY \`FK_4346e837d27a429e70f1b0bc4dd\``);
        await queryRunner.query(`DROP INDEX \`IDX_b01ac273028eb443cb7f9a78b6\` ON \`space_entry_code\``);
        await queryRunner.query(`DROP INDEX \`IDX_4346e837d27a429e70f1b0bc4d\` ON \`space_entry_code\``);
        await queryRunner.query(`DROP TABLE \`space_entry_code\``);
    }

}
