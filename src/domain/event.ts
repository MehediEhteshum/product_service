export enum EventType {
  ReviewCreated = "review.created",
  ReviewUpdated = "review.updated",
}

export interface Event {
  id: string;
  type: EventType;
  data: Record<string, any>;
  topic: string;
  tag: string;
}
