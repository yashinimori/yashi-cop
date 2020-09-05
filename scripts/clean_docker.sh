#!/bin/bash
# https://docs.docker.com/config/pruning/
docker image prune -f
docker image prune -f -a
docker container prune -f
echo 'DONE'

