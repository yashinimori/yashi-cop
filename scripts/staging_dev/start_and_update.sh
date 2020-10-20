#!/bin/bash
docker-compose -f staging_dev.yml up -d --build
docker-compose -f staging_dev.yml run --rm django ./manage.py migrate
