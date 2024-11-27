import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from "@nestjs/common";
import { JwtPayload, verify } from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.getArgByIndex(2)?.req;
    const authHeader =
      request?.headers?.authorization || request?.headers?.Authorization;
    const token = authHeader?.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      this.logger.error("User is not authorized or token is missing");
      throw new UnauthorizedException(
        "User is not authorized or token is missing"
      );
    }

    try {
      const decoded = verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;
      request.user = decoded.user ?? {};
      return true;
    } catch (err) {
      this.logger.error("Invalid or expired token", err);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
