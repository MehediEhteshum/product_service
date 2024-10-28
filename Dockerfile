FROM denoland/deno:2.0.2

WORKDIR /app

COPY deno.json ./
COPY deno.lock ./
COPY package.json ./
COPY src ./src

RUN deno task install
RUN deno task prisma

EXPOSE 5000

CMD ["deno", "task", "start"]
