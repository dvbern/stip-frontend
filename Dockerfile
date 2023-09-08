FROM docker-registry.dvbern.ch/dockerhub/library/caddy:2.6-alpine

ARG APP="${APP_NAME}"

COPY Caddyfile /etc/caddy/Caddyfile
COPY dist/apps/${APP} /srv/app
