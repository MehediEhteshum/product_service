import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { init } from "./core/index.ts";
import { AppModule } from "./index.ts";

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
