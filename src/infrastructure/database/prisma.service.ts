import { Injectable } from "npm:@nestjs/common";
import { PrismaClient } from "npm:@prisma/client";
import process from "node:process";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.SUPABASE_DB_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
