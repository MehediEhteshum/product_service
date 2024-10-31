import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";

@Injectable()
export class AdminRoleGuard implements CanActivate {
  private readonly logger = new Logger(AdminRoleGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user ?? {};

    if (user.role !== "admin") {
      this.logger.error("Access denied: Admins only");
      throw new ForbiddenException("Access denied: Admins only");
    }

    return true;
  }
}
