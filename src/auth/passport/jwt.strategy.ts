import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from 'src/types/global.constanst';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const { _id, name, email, role, phone, children, avatar } = payload;

    if (Array.isArray(children) && children.length > 0) {
      return { _id, name, email, role, phone, children, avatar };
    }

    return { _id, name, email, role, phone, avatar };
  }
}
