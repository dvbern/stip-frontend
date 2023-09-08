FROM docker-registry.dvbern.ch/dockerhub/library/caddy:2.6-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY dist/apps/${APP_NAME} /srv/app
