#!/bin/bash
docker-compose -f staging.yml run --rm django ./manage.py loaddata cop/fixtures/merchant.json
docker-compose -f staging.yml run --rm django ./manage.py loaddata cop/fixtures/reason_code_groups.json
docker-compose -f staging.yml run --rm django ./manage.py loaddata cop/fixtures/statuses.json
docker-compose -f staging.yml run --rm django ./manage.py loaddata cop/fixtures/survey_questions.json
docker-compose -f staging.yml run --rm django ./manage.py loaddata cop/fixtures/system_user.json
docker-compose -f staging.yml run --rm django ./manage.py loaddata cop/fixtures/test_chargeback_officer.json