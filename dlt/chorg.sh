#!/bin/bash


if [ $# -eq 0 ]
then
	echo "Usage: chorg.sh [Organization Domain (i.e. example.com)]"
else
	echo "Update Organization Domain blockchain/environment.js to $1"
	sed -i "/unitedsolutions.biz/ s/unitedsolutions.biz/$1/" blockchain/environment.js
fi
