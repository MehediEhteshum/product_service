import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ReviewRepository } from "../../infrastructure/index.ts";

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.getArgByIndex(2)?.req;
    const user = request?.user ?? {};

    if (user.role !== "admin") {
      this.logger.error("Access denied: Admins only");
      throw new UnauthorizedException("Access denied: Admins only");
    }

    return true;
  }
}

@Injectable()
export abstract class OwnerGuard implements CanActivate {
  protected readonly logger = new Logger(OwnerGuard.name);

  abstract fetchResource(resourceProp: string): Promise<any>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.getArgByIndex(2)?.req;
    const userId = request?.user?.id;
    const resourceProp = context.getArgByIndex(1)?.id;

    if (!userId || !resourceProp) {
      this.logger.error("User ID or resource Prop is missing");
      throw new ForbiddenException("Access denied: insufficient data");
    }

    const resource = await this.fetchResource(resourceProp);
    if (!resource) {
      this.logger.error(`Resource with Prop not found`);
      throw new ForbiddenException("Access denied: resource not found");
    }

    if (resource.userId !== userId) {
      this.logger.error("Access denied: user is not the resource owner");
      throw new UnauthorizedException(
        "Access denied: user is not the resource owner"
      );
    }

    return true;
  }
}

@Injectable()
export class ReviewOwnerGuard extends OwnerGuard {
  constructor(private readonly reviewRepository: ReviewRepository) {
    super();
  }

  override async fetchResource(reviewId: string): Promise<any> {
    return await this.reviewRepository.findOne(reviewId);
  }
}
