#!/bin/bash


echo "Installing cURL..."
sudo apt-get install curl -y

echo "Install Node.js Runtime and NPM..."
sudo tar -C /usr/local -zxvf ./node-v8.9.3.tar.gz

echo "Update PATH for root user..."
sudo sed -i '$ a #Update PATH and set GOPATH' ~root/.bashrc
sudo sed -i '$ a export PATH=$PATH:/usr/local/bin:/usr/local/node/bin' ~root/.bashrc

echo "Update PATH for user..."
cat << EOF >> ~/.bashrc

export PATH=$PATH:/usr/local/bin:/usr/local/node/bin
EOF
source ~/.bashrc

echo "Upgrade NPM to version 5.6.0..."
npm install npm@5.6.0 -g

echo "Installing Python version 2.7..."
sudo apt-get install python -y
