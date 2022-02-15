#!/bin/zsh

## Do not use this script if you've already create a root cert
exit 0

REPO_ROOT_DIR=${0:a:h:h}
SCRIPT_DIR=${0:a:h}
while read i; do eval $i; done < ${REPO_ROOT_DIR}/setup/common-vars.sh

## generate our private key
mkdir -p ${PROJECT_DIR}/certs
CERTS_DIR=${PROJECT_DIR}/certs
openssl genrsa -des3 -out ${CERTS_DIR}/my-certificate-authority.key 4096

## Generating RSA private key, 4096 bit long modulus
## .............+++
## ..................+++
## e is 65537 (0x10001)
## Enter pass phrase for my-certificate-authority.key: jonip5229

## generate a root certificate
openssl req -x509 -new -nodes -key ${CERTS_DIR}/my-certificate-authority.key -sha256 -days 1825 -out ${CERTS_DIR}/my-certificate-authority.pem -subj "/C=US/ST=Mississippi/L=Starkville/O=zapdaz/OU=Development/CN=zapdaz"

## You should now have two files: my-certificate-authority.key (your private key) and
## my-certificate-authority.pem (your root certificate).

sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${CERTS_DIR}/my-certificate-authority.pem
#sudo security delete-certificate -c "<name of existing certificate>"

## Reference:
##sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain <certificate>
##"$HOME/Library/Keychains/login.keychain"

## Installing Your Root Certificate
## You will need to add the root certificate to any laptops, desktops,
## tablets, and phones that will be accessing your HTTPS sites.
## This can be a bit of a pain, but the good news is that we only have
## to do it once. Once our root certificate is on each device, it will
## be good until it expires.

## Adding the Root Certificate to macOS Keychain
## Open the macOS Keychain app
## Go to File > Import Items…
## Select your root certificate file (i.e. my-certificate-authority.pem)
## Search for whatever you answered as the Common Name name above

## Double click on your root certificate in the list
## Expand the Trust section
## Change the When using this certificate: select box to “Always Trust”

## Close the certificate window
## It will ask you to enter your password (or scan your finger), do that
## 🎉 Celebrate!
