#!/bin/sh

# Replace environment variables in the template file
envsubst '${ES_UPSTREAM} ${KAFKA_UPSTREAM} ${REDIS_UPSTREAM} ${ES_PORT} ${KAFKA_PORT} ${REDIS_PORT}' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

# Start Nginx
nginx -g "daemon off;"
