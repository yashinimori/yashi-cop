COP
==============================
Backend is served via Docker for easier set up process.
- API url:  http://0.0.0.0:8000/api/v1
- Authorization via JWT token

<h3>Project set up</h3>

0) Download and install Docker engine https://docs.docker.com/engine/install/ 
1) Download docker-compose https://docs.docker.com/compose/install/
2) Create and start containers. Use -f local.yml for development build and -f prod.yml for production build:
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
   
<h3>Stops containers and removes containers, networks, volumes, and images created by up</h3>
```
docker-compose -f local.yml down --volumes --rmi local
```

<h3>Database backups</h3>
- To create a db backup, run:
```
docker-compose -f local.yml exec postgres backup
```
- To list existing backups,
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
 docker-compose -f local.yml exec django ./manage.py loaddata backups/prod_db.json -e contenttypes -e auth.Permission
```
<h3>Descriptions for docker-compose bash scripts</h3>
 - Django entrypoint script checks availability of postgres container and set up CELERY_BROKER_URL. Runs automatically when the container starts.
 - Django start script runs gunicorn server. Runs automatically in a .yml file in "command" option.

<h3>Commit structure</h3>
Corresponds https://www.conventionalcommits.org/en/v1.0.0/

<h3>Users</h3>
ChargeBack Officer - zJf213Uyfbw_a
