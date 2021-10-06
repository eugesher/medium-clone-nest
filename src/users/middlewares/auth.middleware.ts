import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../../types/express-request.interface';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UsersService } from '../users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      req.user = null;
      next(new UnauthorizedException('authorization required'));
    } else {
      try {
        const jwtPayload = verify(
          authorization.split(' ')[1],
          'dev-key',
        ) as JwtPayload;
        req.user = await this.usersService.findOne(jwtPayload.id);
        next();
      } catch (err) {
        req.user = null;
        next(new UnauthorizedException('authorization required'));
      }
    }
  }
}
