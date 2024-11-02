import { Injectable, Logger } from "@nestjs/common";
import { Review } from "../domain/index.ts";
import { prisma } from "./index.ts";

@Injectable()
export class ReviewRepository {
  private readonly logger = new Logger(ReviewRepository.name);

  async findOne(id: string): Promise<Review | null> {
    try {
      const review = await prisma.review.findUnique({ where: { id } });
      this.logger.log(`Review with id retrieved successfully`);
      return review;
    } catch (error) {
      this.logger.error(`Failed to retrieve review with id`, error);
      throw new Error(`Failed to retrieve review: ${error.message}`);
    }
  }

  async findByProductId(productId: string): Promise<Review[]> {
    try {
      const reviews = await prisma.review.findMany({ where: { productId } });
      this.logger.log(`Reviews retrieved successfully`);
      return reviews;
    } catch (error) {
      this.logger.error(`Failed to retrieve reviews`, error);
      throw new Error(`Failed to retrieve reviews: ${error.message}`);
    }
  }

  async findByUserIdAndProductId(
    userId: string,
    productId: string
  ): Promise<Review | null> {
    try {
      const review = await prisma.review.findFirst({
        where: { userId, productId },
      });
      this.logger.log(`Review retrieved successfully`);
      return review;
    } catch (error) {
      this.logger.error(`Failed to retrieve review`, error);
      throw new Error(`Failed to retrieve review: ${error.message}`);
    }
  }

  async create(review: Omit<Review, "id">): Promise<Review> {
    try {
      const createdReview = await prisma.review.create({ data: review });
      this.logger.log(`Review created successfully`);
      return createdReview;
    } catch (error) {
      this.logger.error(`Failed to create review`, error);
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  async update(id: string, review: Review): Promise<Review | null> {
    try {
      const updatedReview = await prisma.review.update({
        where: { id },
        data: review,
      });
      this.logger.log(`Review with id updated successfully`);
      return updatedReview;
    } catch (error) {
      this.logger.error(`Failed to update review with id`, error);
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }

  async deleteByProductId(productId: string): Promise<void> {
    try {
      await prisma.review.deleteMany({ where: { productId } });
      this.logger.log(`Reviews deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete reviews`, error);
      throw new Error(`Failed to delete reviews: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Review | null> {
    try {
      const deletedReview = await prisma.review.delete({ where: { id } });
      this.logger.log(`Review with id deleted successfully`);
      return deletedReview;
    } catch (error) {
      this.logger.error(`Failed to delete review with id`, error);
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }
}
