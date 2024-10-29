FROM denoland/deno:2.0.2 

WORKDIR /app

# Install OpenSSL
USER root
RUN apt-get update -y && apt-get install -y openssl

# Copy project files
COPY deno.json ./
COPY deno.lock ./
COPY package.json ./
COPY src ./src

# Install dependencies
RUN deno task install
RUN deno task prisma

EXPOSE 5000

CMD ["deno", "task", "start"]
