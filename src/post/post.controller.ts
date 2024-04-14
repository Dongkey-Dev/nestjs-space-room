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
  createChatSchema,
  createPostSchema,
  updateChatSchema,
  updatePostSchema,
} from './post.usecase';
import { createZodDto } from '@anatine/zod-nestjs';

class CreatePostSchema extends createZodDto(createPostSchema) {}
class UpdatePostSchema extends createZodDto(updatePostSchema) {}

class CreateChatSchema extends createZodDto(createChatSchema) {}
class UpdateChatSchema extends createZodDto(updateChatSchema) {}

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
  @Get('all')
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
  async deletePost(
    @Query('postId') postId: string,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.deletePost(
      new T_UUID(user.id),
      new T_UUID(postId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('chat')
  async createChat(
    @Body() dto: CreateChatSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.createChat(new T_UUID(user.id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('chat')
  async updateChat(
    @Body() dto: UpdateChatSchema,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.updateChat(new T_UUID(user.id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('chat')
  async deleteChat(
    @Query('chatId') chatId: string,
    @AuthUser() user: UserFromToken,
  ) {
    return await this.postUsecase.deleteChat(
      new T_UUID(user.id),
      new T_UUID(chatId),
    );
  }
}
