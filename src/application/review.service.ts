import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminGuard, AuthGuard, ReviewOwnerGuard } from "../core/index.ts";
import { Review } from "../domain/index.ts";
import { ReviewRepository } from "../infrastructure/index.ts";
import { CreateReviewInput, UpdateReviewInput } from "./index.ts";

@Resolver(() => Review)
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  //@access public
  @Query(() => [Review], { name: "productReviews" })
  async findReviewsByProductId(
    @Args("productId", { type: () => String }) productId: string
  ): Promise<Review[]> {
    const reviews = await this.reviewRepository.findByProductId(productId);
    return reviews.sort((a, b) => b.rating - a.rating);
  }

  //@access public
  @Query(() => Review, { name: "review" })
  async findOne(
    @Args("id", { type: () => String }) id: string
  ): Promise<Review | null> {
    return await this.reviewRepository.findOne(id);
  }

  //@access private
  @Mutation(() => Review, { name: "createReview" })
  @UseGuards(AuthGuard)
  async create(
    @Args("createReviewInput") createReviewInput: CreateReviewInput,
    @Context() context: any
  ): Promise<Review> {
    const reviewData: Omit<Review, "id"> = {
      ...createReviewInput,
      comment: createReviewInput.comment ?? "",
      userId: context.req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.reviewRepository.create(reviewData);
  }

  //@access private & RBAC
  @Mutation(() => Review, { name: "updateReview" })
  @UseGuards(AuthGuard, ReviewOwnerGuard)
  async update(
    @Args("id", { type: () => String }) id: string,
    @Args("updateReviewInput") updateReviewInput: UpdateReviewInput
  ): Promise<Review | null> {
    const existingReview = await this.reviewRepository.findOne(id);
    if (existingReview) {
      const updatedData: Review = {
        ...existingReview,
        rating: updateReviewInput.rating ?? existingReview.rating,
        comment: updateReviewInput.comment ?? existingReview.comment,
        updatedAt: new Date(),
      };
      return await this.reviewRepository.update(id, updatedData);
    }
    return null;
  }

  //@access private & RBAC
  @Mutation(() => Review, { name: "removeReview" })
  @UseGuards(AuthGuard, ReviewOwnerGuard)
  async remove(
    @Args("id", { type: () => String }) id: string
  ): Promise<Review | null> {
    return await this.reviewRepository.remove(id);
  }

  //@access private
  @Mutation(() => Boolean, { name: "removeProductReviews" })
  @UseGuards(AuthGuard, AdminGuard)
  async deleteReviewsByProductId(
    @Args("productId", { type: () => String }) productId: string
  ): Promise<boolean> {
    await this.reviewRepository.deleteByProductId(productId);
    return true;
  }
}
