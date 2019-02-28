#!/bin/bash

DATE=`date "+%m%d%Y%H%M%S"`
MS_PID=`pidof node`

if [ "$1" = "start" ]; then
	echo "Shutting down microservice..."
	kill -9  $MS_PID
	echo "Moving log file..."
	mv logs/microservice.log logs/microservice.log.$DATE
	echo "Starting microservice..."
	node server.js > logs/microservice.log 2>&1 &
elif [ "$1" = "stop" ]; then
	echo "Shutting down microservice..."
	kill -9 $MS_PID
else
	echo "Usage: ms.sh [start|stop]"
fi
