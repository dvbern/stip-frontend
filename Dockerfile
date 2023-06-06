FROM docker-registry.dvbern.ch/dockerhub/library/caddy:2.6-alpine

ARG APP="gesuch-app"

COPY Caddyfile /etc/caddy/Caddyfile
COPY dist/apps/${APP} /srv/app
