# Frequently used commands and some notes:

- The user correctly points out that the ProductService and ProductRepository seem redundant. The ProductService is acting as a thin wrapper around the ProductRepository. In this simple example, directly connecting the ProductController to the ProductRepository would be sufficient. However, for larger applications, a service layer provides benefits like abstraction, testability, and the ability to add business logic without modifying the repository.

// service urls for docker use

```
ES_URL=http://elasticsearch:9200
REDIS_HOST=redis
REDIS_PORT=6379
EVENT_BROKER_URL=kafka:9092
```

// deno
`deno i --allow-scripts` / `deno i npm:<package-name> --allow-scripts` >> install dependencies
`deno i npm:<package-name> --dev` >> install dev dependencies
`deno task <custom-task-in-deno.json>` >> run custom task

// prisma
`npx prisma db push` >> initiates the prisma client; doesn't modify existing database
`npx prisma migrate dev --name init` >> initiates the prisma client; may modify existing database
`npx prisma generate` or `npx prisma generate --no-engine` >> initiates the prisma client

// kafka
`docker exec -it kafka bash` >> enter kafka container
`kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic <topic_name> --from-beginning` >> consume events via kafka-console-consumer
`kafka-topics.sh --list --bootstrap-server localhost:9092` >> list topics via kafka-topics
`kafka-topics.sh --delete --topic <topic_name> --bootstrap-server localhost:9092` >> delete topic via kafka-topics
`kafka-topics.sh --create --topic <topic_name> --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1` >> create topic via kafka-topics

- `KAFKA_DELETE_TOPIC_ENABLE=true` in docker-compose.yml or `delete.topic.enable=true` in kafka server.properties, so that the topic can be deleted using kafka cli.
- Setting a retention time for Kafka events requires configuring the Kafka broker itself, typically through its configuration files or a management tool. This is not something that can be done within the application code. You will need to consult your Kafka broker's documentation to learn how to configure the retention policy for your topics. A common approach is to set a retention time (e.g., 3 days) for the topic "review-events" in your Kafka broker's configuration.
- Broker-level configurations are ideal for setting global defaults.
- Topic-level configurations can be set programmatically to override defaults for specific topics, as demonstrated in the KafkaJS Admin API example.

# NestJS, Prisma Client, and GraphQL:

In schema.prisma, use custom output directory for Deno:

```
generator client {
  provider = "prisma-client-js"
  output   = "../../../../node_modules/.prisma/client"
}
```

Then, import where needed as (for Deno):
`import { PrismaClient } from "../../node_modules/.prisma/client/index.js";`

[`deno cache --reload ./src/main.ts`]
`deno i --allow-scripts`
[`deno add npm:@types/node --dev`]
`npx prisma migrate dev --name init` >> also initiates the prisma client; may modify existing database
[`npx prisma db push`] >> also initiates the prisma client; doesn't modify existing database
[`npx prisma generate` or `npx prisma generate --no-engine`] >> also initiates the prisma client
`deno task start` >> (`deno run --watch --allow-read --allow-env --allow-net --allow-sys --allow-ffi ./src/main.ts`)
[check use of "" in env variables]

# Clean Architecture:

Core Folder:

    constants.ts (for constants used across the project)

    interfaces.ts (for shared interfaces)

    decorators.ts (for custom decorators)

    guards.ts (for authentication and authorization guards)

Application Folder:

    controllers/

    user.controller.ts

    auth.controller.ts

    services/

    user.service.ts

    auth.service.ts

    dtos/

    create-user.dto.ts

    login.dto.ts

Domain Folder:

    entities/

    user.entity.ts

    repositories/

    user.repository.ts

Infrastructure Folder:

    database/

    database.module.ts

    database.providers.ts

    migrations/

    create-user-table.ts
