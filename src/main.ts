import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { init } from "./core/index";
import { AppModule } from "./index";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  await app.listen(port);
  let url = await app.getUrl();
  url = url == `http://[::]:${port}` ? `http://127.0.0.1:${port}` : url;
  console.log(`Application is running on: ${url}/products`);
}
init();
bootstrap();
