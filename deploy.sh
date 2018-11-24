#!/bin/bash
# fail fast after any error in commands
set -e

git checkout master

eval $(docker-machine env main)

docker build -t hub.ferumflex.com/ferumflex/bank:prod . && docker push hub.ferumflex.com/ferumflex/bank:prod

now=$(date +"%Y/%m/%d")
base="Prod/$now"
tag="$base"
count=1

while true
do
  if git show-ref -q --verify "refs/tags/$tag" 2>/dev/null; then
    count=$((count+1))
    tag="${base}_${count}"
  else
    break
  fi
done

git tag -a "$tag" -m "Production $now"

git push origin master
git push origin "$tag"

docker stack deploy -c docker-swarm.yml bank --with-registry-auth --prune
