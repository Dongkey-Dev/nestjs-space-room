import { Module } from '@nestjs/common';
import { UserDomainModule } from 'src/domain/user/user.domain.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/util/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserDomainModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'JWT_STRATEGY',
      useFactory: () => {
        const secret = process.env.JWT_SECRET_KEY;
        return new JwtStrategy(secret);
      },
    },
    {
      provide: 'UserUsecase',
      useClass: UserService,
    },
  ],
})
export class UserModule {}
