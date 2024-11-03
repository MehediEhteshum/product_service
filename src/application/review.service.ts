import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminGuard, AuthGuard, ReviewOwnerGuard } from "../core/index.ts";
import { Event, EventType, Review } from "../domain/index.ts";
import {
  EventProducerService,
  ReviewRepository,
} from "../infrastructure/index.ts";
import { CreateReviewInput, UpdateReviewInput } from "./index.ts";

@Resolver(() => Review)
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly eventProducer: EventProducerService
  ) {}

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
    const userId = context.req.user.id;
    const existingReview = await this.reviewRepository.findByUserIdAndProductId(
      userId,
      createReviewInput.productId
    );
    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }
    const reviewData: Omit<Review, "id"> = {
      ...createReviewInput,
      comment: createReviewInput.comment ?? "",
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const review = await this.reviewRepository.create(reviewData);
    if (review.rating < 4) {
      const reviewCreated: Event = {
        id: review.id,
        type: EventType.ReviewCreated,
        data: { review },
        topic: "review-events",
        tag:
          review.rating < 3
            ? "critical"
            : review.rating === 3
            ? "moderate"
            : "good",
      };
      await this.eventProducer.produceEvent(reviewCreated);
    }
    return review;
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
      const updatedReview = await this.reviewRepository.update(id, updatedData);
      if (updatedReview!.rating < 4) {
        const reviewUpdated: Event = {
          id: updatedReview!.id,
          type: EventType.ReviewUpdated,
          data: { review: updatedReview },
          topic: "review-events",
          tag:
            updatedReview!.rating < 3
              ? "critical"
              : updatedReview!.rating === 3
              ? "moderate"
              : "good",
        };
        await this.eventProducer.produceEvent(reviewUpdated);
      }
      return updatedReview;
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
