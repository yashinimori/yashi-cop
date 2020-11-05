
<h3>Project set up as service</h3>

1. Copy service descriptor file 'docker.cop.service' into /etc/systemd/system/
    * if you need to run it with different then 'staging.yml' config file, edit it in 'docker.cop.service' file.
2. Enable starting the service on system boot with the following command:
    ```
    systemctl enable docker.cop
    ```
After this all docker-compose conteiners will start automatically, after system start/reboot. Also you can start service manually:
    ```
    sudo service docker.cop start
    ```