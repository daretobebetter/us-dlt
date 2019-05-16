#!/bin/bash


echo "Installing cURL..."
sudo apt-get install curl -y

echo "Install Node.js Runtime and NPM..."
sudo mkdir /usr/local/nvm
sudo chown -R dlt:dlt /usr/local/nvm

export NVM_DIR=/usr/local/nvm
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

echo "Installing Python version 2.7..."
sudo apt-get install python -y
