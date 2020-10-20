docker-compose -f staging_prod.yml up -d --build
docker-compose -f staging_prod.yml run --rm django ./manage.py migrate
