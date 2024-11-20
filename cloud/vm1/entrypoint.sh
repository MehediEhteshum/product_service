#!/bin/sh

# Replace environment variables in the template file
envsubst '${DEFAULT_UPSTREAM} ${ES_UPSTREAM} ${KAFKA_UPSTREAM} ${REDIS_UPSTREAM} ${DB_UPSTREAM} ${DB_DIRECT_UPSTREAM} ${DEFAULT_PORT} ${ES_PORT} ${KAFKA_PORT} ${REDIS_PORT} ${DB_PORT} ${DB_DIRECT_PORT}' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

# Start Nginx
nginx -g "daemon off;"
