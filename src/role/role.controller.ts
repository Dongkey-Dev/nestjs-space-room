import {
  Body,
  Controller,
  Delete,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  RoleUsecase,
  createRoleSchema,
  updateRoleSchema,
} from './role.usecase';
import { AuthGuard } from '@nestjs/passport';
import { createZodDto } from '@anatine/zod-nestjs';
import { T_UUID } from 'src/util/uuid';
import { AuthUser, UserFromToken } from 'src/common/auth.decorator';

class CreateRoleSchema extends createZodDto(createRoleSchema) {}
class UpdateRoleSchema extends createZodDto(updateRoleSchema) {}

@Controller('role')
export class RoleController {
  constructor(
    @Inject('RoleUsecase')
    private readonly roleUsecase: RoleUsecase,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRole(
    @Body() dto: CreateRoleSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.roleUsecase.addRole(
      new T_UUID(user.id),
      new T_UUID(dto.spaceId),
      dto.roleList,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateRole(
    @Body() dto: UpdateRoleSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.roleUsecase.updateUserRole(
      new T_UUID(user.id),
      new T_UUID(dto.targetUserUuid),
      new T_UUID(dto.spaceId),
      new T_UUID(dto.roleId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteRole(
    @Query('spaceId') spaceId: string,
    @Query('roleId') roleId: string,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.roleUsecase.removeRole(
      new T_UUID(user.id),
      new T_UUID(spaceId),
      new T_UUID(roleId),
    );
  }
}
