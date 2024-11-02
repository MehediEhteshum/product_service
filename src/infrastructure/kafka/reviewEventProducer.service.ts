import { Injectable, Logger } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { Review } from "../../domain/index.ts";

interface ReviewEventData {
  reviewId: string;
  productId: string;
  rating: number;
  comment: string;
  userId: string;
  upDatedAt: Date;
  tag: string;
}

@Injectable()
export class ReviewEventProducerService {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger = new Logger(ReviewEventProducerService.name);

  constructor() {
    this.kafka = new Kafka({
      brokers: ["localhost:9092"],
      clientId: "product-service",
    });
    this.producer = this.kafka.producer();
    this.connect();
  }

  async connect() {
    try {
      await this.producer.connect();
      this.logger.log("Event producer connected successfully");
    } catch (error) {
      this.logger.error("Failed to connect to Event producer", error);
      throw new Error(`Failed to connect to Event producer: ${error.message}`);
    }
  }

  async produceReviewEvent(review: Review): Promise<void> {
    const reviewEventData: ReviewEventData = {
      reviewId: review.id,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      upDatedAt: review.updatedAt,
      tag:
        review.rating < 3
          ? "critical"
          : review.rating == 3
          ? "moderate"
          : "good",
    };
    try {
      await this.producer.send({
        topic: "review-events",
        messages: [{ value: JSON.stringify(reviewEventData) }],
      });
      this.logger.log(`Review event produced successfully`);
    } catch (error) {
      this.logger.error("Failed to produce review event", error);
      throw new Error(`Failed to produce review event: ${error.message}`);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
    this.logger.log("Event producer disconnected");
  }
}
