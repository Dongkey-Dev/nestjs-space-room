import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser, UserFromToken } from 'src/common/auth.decorator';
import {
  SpaceUsecase,
  createSpaceSchema,
  joinSpaceSchema,
} from './space.usecase';
import { createZodDto } from '@anatine/zod-nestjs';
import { T_UUID } from 'src/util/uuid';

class CreateSpaceDto extends createZodDto(createSpaceSchema) {}
class JoinSpaceDto extends createZodDto(joinSpaceSchema) {}

@Controller('space')
export class SpaceController {
  constructor(
    @Inject('SpaceUsecase')
    private readonly spaceUsecase: SpaceUsecase,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createSpace(
    @Body() dto: CreateSpaceDto,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.spaceUsecase.create(new T_UUID(user.id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('join')
  async joinSpace(@Body() dto: JoinSpaceDto, @AuthUser() user: UserFromToken) {
    const member = await this.spaceUsecase.join(
      new T_UUID(user.id),
      dto.inviteCode,
    );
    return {
      spaceId: member.getSpaceId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('join')
  async getJoinedSpace(@AuthUser() user: UserFromToken) {
    return await this.spaceUsecase.getJoinedSpaces(new T_UUID(user.id));
  }
}
