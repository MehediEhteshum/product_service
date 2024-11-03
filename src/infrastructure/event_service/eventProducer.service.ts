import { Injectable, Logger } from "@nestjs/common";
import { Kafka, Partitioners, Producer } from "kafkajs";
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
  private readonly logger: Logger = new Logger(EventProducerService.name);

  constructor() {
    this.kafka = new Kafka({
      brokers: [process.env.EVENT_BROKER_URL || "localhost:9092"],
      clientId: process.env.EVENT_BROKER_CLIENT_ID || "product-service",
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
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

  async produceEvent(event: Event): Promise<void> {
    const eventData: EventData = {
      eventId: event.id,
      eventType: event.type,
      data: event.data,
      tag: event.tag,
    };
    try {
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
    await this.producer.disconnect();
    this.logger.log("Event producer disconnected");
  }
}
