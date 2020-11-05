FROM traefik:v2.2
RUN mkdir -p /etc/traefik/acme
RUN touch /etc/traefik/acme/acme.json
RUN chmod 600 /etc/traefik/acme/acme.json
COPY ./compose/staging_prod/traefik/traefik.yml /etc/traefik
