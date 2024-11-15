FROM nginx:alpine

# Install envsubst (part of GNU gettext) and nginx-mod-stream for TCP proxying
RUN apk add --no-cache gettext nginx-mod-stream

# Copy the Nginx configuration with placeholders
COPY nginx.conf /etc/nginx/nginx.template.conf

# Entry point script to replace variables and start Nginx
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
