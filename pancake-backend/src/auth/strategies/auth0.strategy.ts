import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, SecretOrKeyProvider } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const audience = configService.get<string>('AUTH0_AUDIENCE');
    const issuer = domain ? `https://${domain}/` : undefined;

    if (!issuer || !audience) {
      throw new Error('Auth0 issuer or audience is missing');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience,
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}.well-known/jwks.json`,
      }) as SecretOrKeyProvider,
    });
  }

  async validate(payload: { sub?: string; email?: string }) {
    const auth0Id = payload.sub;
    const email = payload.email;

    const user = auth0Id
      ? await this.usersService.findByAuth0Id(auth0Id)
      : null;
    const fallbackUser = !user && email ? await this.usersService.findByEmail(email) : null;

    if (!user && !fallbackUser) {
      throw new UnauthorizedException();
    }

    const resolvedUser = user ?? fallbackUser;

    if (!resolvedUser) {
      throw new UnauthorizedException();
    }

    return {
      userId: resolvedUser.id,
      email: resolvedUser.email,
      nombre: resolvedUser.nombre,
    };
  }
}
