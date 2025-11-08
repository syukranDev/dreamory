import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphqlJwtAuthGuard {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization header');
    }

    const token = authHeader.substring(7); ///notedev: we get the tokenn only wihtout Bearer
    console.log(token);
    
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}