import { Module } from '@nestjs/common';
import { UserDomainModule } from 'src/domain/user/user.domain.module';
import { UserController } from './user.controller';
import { UserSerivce } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/util/strategy/jwt.strategy';

@Module({
  imports: [
    UserDomainModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'JWT_STRATEGY',
      useFactory: async () => {
        const secret = process.env.JWT_SECRET_KEY;
        return new JwtStrategy(secret);
      },
    },
    {
      provide: 'UserUsecase',
      useClass: UserSerivce,
    },
  ],
})
export class UserModule {}
