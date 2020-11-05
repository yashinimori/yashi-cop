COP
==============================
Backend is served via Docker for easier set up process.
- API url:  http://0.0.0.0:8000/api/v1
- Authorization via JWT token

<h3>Project set up</h3>

0. Download and install Docker engine https://docs.docker.com/engine/install/ 
1. Download docker-compose https://docs.docker.com/compose/install/
2. Create and start containers:
    * For local development build - local.yml
        1) Create and start containers.            
            ```
            docker-compose -f local.yml up -d
            ```
        3) Create super user:
            ```
            docker-compose -f local.yml run --rm django ./manage.py createsuperuser
            ```         
        4) Navigate to the frontend folder and install Frontend dependencies
            ```
            npm i
            ```
        5) Start Frontend
            ```
            ng serve
            ```
        6) Go to http://localhost:4200

    *  For AWS development/test builds - staging_dev.yml
        1) Copy project folder into /var/www/
        2) Create and start containers.        
            ```
            docker-compose -f staging_dev.yml up -d
            ```
        3) Create super user:
            ```
            docker-compose -f staging_dev.yml run --rm django ./manage.py createsuperuser
            ```         
        4) Install it as service. (for details look at service\Readme.md )
    * For another builds - staging_prod.yml
        0) disable debug mode (?)
        1) Copy project folder into /var/www/
        2) Create folder '.envs/.staging_prod', and copy all into it from .envs/.staging_dev
        3) Open file .envs/.staging_prod/.django, and change 
            * DJANGO_ALLOWED_HOSTS= {current instance ip}
            * DJANGO_SECRET_KEY= {have to generate new key}
            * <s>DJANGO_ENCRYPT_KEY= {have to generate new key}</s>
                - for generation new keys may be used command:
                    ```
                    python manage.py shell -c 'from django.core.management import utils; print(utils.get_random_secret_key())'
                    ```
        4) Open file 'frontend\src\app\share\urlConstants.ts', change variable export const, where {instance_ip} - is current server external ip:
                    ```
                    MAIN_URL = 'http://{instance_ip}';
                    ```
        5) Open file 'compose\staging_prod\traefik\traefik.yml', and replace all hosts '18.156.118.192' with current server external ip.
        6) Create and start containers.        
            ```
            docker-compose -f staging_prod.yml up -d
            ```
        7) Create super user:
            ```
            docker-compose -f staging_prod.yml run --rm django ./manage.py createsuperuser
            ```         
        8) Install it as service. (for details look at service/Readme.md )
3. Load initial data. Run bash script:
    ```
    scripts/staging_dev/load_initial_data.sh
	# or
    scripts/staging_prod/load_initial_data.sh
    ```

   
<h3>Stops containers and removes containers, networks, volumes, and images created by up</h3>
    ```
    docker-compose -f local.yml down --volumes --rmi local
    ```
<h3>Rebuild containers images (after source code update) </h3>
    ```
    docker-compose -f staging_dev.yml up -d --build
    ### or run bash script
    ./scripts/staging_dev/start_and_update.sh
    ```

<h3>Database backups</h3>
- To create a db backup, run:
    ```
    docker-compose -f local.yml exec postgres backup
    ```
- To list existing backups:
    ```
    docker-compose -f local.yml exec postgres backups
    ```
- Copying Backups Locally
    ```
    docker cp CONTAINER_ID:/backups ./backups
    ```
- Restoring from the Existing Backup
    ```
    docker-compose -f local.yml exec postgres restore backup_2018_03_13T09_05_07.sql.gz
    ```
- Restoring from the Existing django Backup
    ```
    docker-compose -f local.yml exec django ./manage.py loaddata initial_data
    ```
<h3>Descriptions for docker-compose bash scripts</h3>
 - Django entrypoint script checks availability of postgres container and set up CELERY_BROKER_URL. Runs automatically when the container starts.
 - Django start script runs gunicorn server. Runs automatically in a .yml file in "command" option.

<h3>Commit structure</h3>
Corresponds https://www.conventionalcommits.org/en/v1.0.0/

<h3>Users</h3>
ChargeBack Officer - email: officer@cop.cop, password: zJf213Uyfbw_a
Test Merchant - email: merchant@cop.cop, password: zJf213Uyfbw_a
