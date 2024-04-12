import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser, UserFromToken } from 'src/common/auth.decorator';
import { SpaceUsecase, createSpaceSchema } from './space.usecase';
import { createZodDto } from '@anatine/zod-nestjs';
import { T_UUID } from 'src/util/uuid';

class CreateSpaceDto extends createZodDto(createSpaceSchema) {}

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
}
