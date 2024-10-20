import { NestFactory } from "npm:@nestjs/core";
import { AppModule } from "./app.module.ts";
import { init } from "./core/init.ts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
init();
bootstrap();
