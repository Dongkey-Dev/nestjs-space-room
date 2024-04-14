import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { T_UUID } from 'src/util/uuid';
import { AuthUser, UserFromToken } from 'src/common/auth.decorator';
import {
  PostUsecase,
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from './post.usecase';
import { createZodDto } from '@anatine/zod-nestjs';

class CreatePostSchema extends createZodDto(createPostSchema) {}
class UpdatePostSchema extends createZodDto(updatePostSchema) {}
class DeletePostSchema extends createZodDto(deletePostSchema) {}

@Controller('post')
export class PostController {
  constructor(
    @Inject('PostUsecase')
    private readonly postUsecase: PostUsecase,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getPost(
    @Query('postId') postId: string,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.getPost(
      new T_UUID(user.id),
      new T_UUID(postId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllPost(
    @Query('spaceId') spaceId: string,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.getPostAll(
      new T_UUID(user.id),
      new T_UUID(spaceId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(
    @Body() dto: CreatePostSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.createPost(new T_UUID(user.id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updatePost(
    @Body() dto: UpdatePostSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.updatePost(new T_UUID(user.id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteRole(
    @Body() dto: DeletePostSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.deletePost(
      new T_UUID(user.id),
      new T_UUID(dto.postId),
    );
  }
}
