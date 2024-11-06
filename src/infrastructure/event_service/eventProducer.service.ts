import { Injectable, Logger } from "@nestjs/common";
import { Admin, Kafka, Partitioners, Producer } from "kafkajs";
import { Event, EventType } from "../../domain/index.ts";

interface EventData {
  eventId: string;
  eventType: EventType;
  data: Record<string, any>;
  tag: string;
}

@Injectable()
export class EventProducerService {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly admin: Admin;
  private readonly logger: Logger = new Logger(EventProducerService.name);
  private readonly globalRetentionMs = 3 * 24 * 60 * 60 * 1000;

  constructor() {
    this.kafka = new Kafka({
      brokers: [process.env.EVENT_BROKER_URL || "localhost:9092"],
      clientId: process.env.EVENT_BROKER_CLIENT_ID || "product-service",
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    this.admin = this.kafka.admin();
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

  private async createTopic(
    topic: string,
    retentionMs: number = this.globalRetentionMs
  ) {
    await this.admin.connect();
    const topics = await this.admin.listTopics();

    if (!topics.includes(topic)) {
      await this.admin.createTopics({
        topics: [
          {
            topic: topic,
            numPartitions: 1,
            replicationFactor: 1,
            configEntries: [
              {
                name: "retention.ms",
                value: retentionMs.toString(),
              },
            ],
          },
        ],
      });
      this.logger.log(
        `Created topic with a retention policy of ${retentionMs}ms`
      );
    }
    await this.admin.disconnect();
  }

  async produceEvent(event: Event): Promise<void> {
    const eventData: EventData = {
      eventId: event.id,
      eventType: event.type,
      data: event.data,
      tag: event.tag,
    };

    try {
      await this.createTopic(event.topic);

      await this.producer.send({
        topic: event.topic,
        messages: [{ value: JSON.stringify(eventData) }],
      });
      this.logger.log(`Event produced successfully: ${event.type}`);
    } catch (error) {
      this.logger.error("Failed to produce event", error);
      throw new Error(`Failed to produce event: ${error.message}`);
    }
  }

  async disconnect() {
    // A potential use case would be to gracefully disconnect the producer during application shutdown to prevent resource leaks and ensure that any in-flight messages are handled appropriately.  This would typically be done in a shutdown hook or a dedicated method called during application termination.
    await this.producer.disconnect();
    this.logger.log("Event producer disconnected");
  }
}
