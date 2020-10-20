docker-compose -f staging.yml up -d --build
docker-compose -f staging.yml run --rm django ./manage.py migrate
