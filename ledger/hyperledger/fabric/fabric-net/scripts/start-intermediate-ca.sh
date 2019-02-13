#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

source $(dirname "$0")/env.sh
initOrgVars $ORG

set -e

# Wait for the root CA to start
waitPort "root CA to start" 60 $ROOT_CA_LOGFILE $ROOT_CA_HOST 7054

# Initialize the intermediate CA
fabric-ca-server init -b $BOOTSTRAP_USER_PASS -u $PARENT_URL

# Remove genesis root certificate
rm $FABRIC_CA_SERVER_HOME/ca-cert.pem

# Add the custom orgs
for o in $FABRIC_ORGS; do
   aff=$aff"\n   $o: []"
done
aff="${aff#\\n   }"
sed -i "/affiliations:/a \\   $aff" \
   $FABRIC_CA_SERVER_HOME/fabric-ca-server-config.yaml
sed -i "/North Carolina/ s/North Carolina/Maryland/" \
   $FABRIC_CA_SERVER_HOME/fabric-ca-server-config.yaml
sed -i "/ L:/ s/ L:/ L: Rockville/" \
   $FABRIC_CA_SERVER_HOME/fabric-ca-server-config.yaml
sed -i "/O: Hyperledger/ s/O: Hyperledger/O: \"United Solutions LLC\"/" \
   $FABRIC_CA_SERVER_HOME/fabric-ca-server-config.yaml
sed -i "/OU: Fabric/ s/OU: Fabric/OU: IT/" \
   $FABRIC_CA_SERVER_HOME/fabric-ca-server-config.yaml

# Initialize the intermediate CA
fabric-ca-server init -b $BOOTSTRAP_USER_PASS -u $PARENT_URL

# Copy the intermediate CA's certificate chain to the data directory to be used by others
cp $FABRIC_CA_SERVER_HOME/ca-chain.pem $TARGET_CHAINFILE

# Start the intermediate CA
fabric-ca-server start
