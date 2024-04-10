import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserFromToken = {
  id: string;
  iat: number;
  exp: number;
};

export type UserTokenKeys = keyof UserFromToken;

export const AuthUser = createParamDecorator(
  (tokenKey: UserTokenKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userFromToken = {
      id: request.user.id,
      iat: request.user.iat,
      exp: request.user.exp,
    } as UserFromToken;

    return !!tokenKey ? userFromToken[tokenKey] : userFromToken;
  },
);
