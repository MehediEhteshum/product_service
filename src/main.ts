import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import process from "node:process";
import { AppModule } from "./app.module.ts";
import { init } from "./core/init.ts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}/products`);
}
init();
bootstrap();
