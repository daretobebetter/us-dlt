#!/bin/bash


echo "Installing cURL..."
sudo apt-get install curl -y

echo "Installing dependencies for Docker..."
sudo apt-get install libltdl7 -y

echo "Installing Docker..."
sudo dpkg -i ./docker-ce.deb

echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

echo "Change executable permission for Docker Compose..."
sudo chmod +x /usr/local/bin/docker-compose

echo "Installing Go Programming Language..."
sudo tar -C /usr/local -zxvf ./go1.11.2.tar.gz

echo "Install Node.js Runtime and NPM..."
sudo tar -C /usr/local -zxvf ./node-v8.9.3.tar.gz

echo "Upgrade NPM to version 5.6.0..."
npm install npm@5.6.0 -g

echo "Installing Python version 2.7..."
sudo apt-get install python -y

echo "Update GOPATH and PATH for root user..."
sudo sed -i '$ a #Update PATH and set GOPATH' ~root/.bashrc
sudo sed -i '$ a export PATH=$PATH:/usr/local/go/bin:/usr/local/bin:/usr/local/node/bin' ~root/.bashrc
sudo sed -i '$ a export GOPATH=/opt/gopath' ~root/.bashrc

echo "Update GOPATH and PATH for user..."
cat << EOF >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin:/usr/local/bin:/usr/local/node/bin
export GOPATH=/opt/gopath
EOF
