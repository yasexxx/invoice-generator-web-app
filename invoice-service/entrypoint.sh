#!/bin/sh
[ -f /run/secrets/db_user ]     && export SPRING_DATASOURCE_USERNAME=$(cat /run/secrets/db_user)
[ -f /run/secrets/db_password ] && export SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/db_password)
exec java -jar app.jar "$@"
