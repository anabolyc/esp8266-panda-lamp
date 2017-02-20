#!/bin/bash

# patch config

if [ ! -f /www/.package.json.patched ]; then
	echo "Patching package.json"
	sed -e "s@ESP_HOST@${ESP_HOST}@" -i /www/package.json
	touch /www/.package.json.patched
else
	echo "package.json appears to be patched already"
fi


#if [ ! -f /data/data.db ]
#then
#	echo "Database file not found at /data/data.db, trying to create one"
#	sqlite3 /data/data.db < /var/db.sql
#fi

# update data
#echo "Starting data update every 10 seconds"
#while true
#do
#	timeout -sHUP 1m request_data -d /data/data.db -u http://192.168.1.90:8080/data
#	sleep 10
#done &

npm start

