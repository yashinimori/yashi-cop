#!/bin/bash
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/merchant.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/reason_code_groups.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/statuses.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/survey_questions.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/system_user.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/test_chargeback_officer.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/cc_branches.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/ch_users.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/security_users.json
docker-compose -f staging_dev.yml run --rm django ./manage.py loaddata cop/fixtures/test_chargeback_officer.json

