import { createZodDto } from '@anatine/zod-nestjs';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import {
  UserUsecase,
  createUserDtoSchema,
  loginUserDtoSchema,
} from './user.usecase';

class createUserDto extends createZodDto(createUserDtoSchema) {}
class loginUserDto extends createZodDto(loginUserDtoSchema) {}

@Controller('user')
export class UserController {
  constructor(
    @Inject('UserUsecase')
    private readonly userUsecase: UserUsecase,
  ) {}

  @Post()
  async createUser(@Body() dto: createUserDto) {
    const user = await this.userUsecase.createUser(dto);
    return user.getProfile(user.getId());
  }

  @Post('login')
  async loginUser(@Body() dto: loginUserDto, @Res({ passthrough: true }) res) {
    const { email, password } = dto;
    const { user, accessToken, refreshToken } =
      await this.userUsecase.loginUser(email, password);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return { profile: user.getProfile(), accessToken, refreshToken };
  }
}
