#!/bin/zsh

REPO_ROOT_DIR=${0:a:h:h}
SCRIPT_DIR=${0:a:h}
while read i; do eval $i; done < ${REPO_ROOT_DIR}/setup/common-vars.sh

mkdir -p ${PROJECT_DIR}/certs
CERTS_DIR=${PROJECT_DIR}/certs
CA_CERTS_DIR=/Users/michaelprescott/Developer/Certs/my-certificate-authority

function handleIncorrectTarget() {
    echo "You must specify a root domain, zapdaz.com."
}

if [ $# -eq 0 ]; then
    handleIncorrectTarget
else
    ROOT_DOMAIN=$@
    echo ROOT_DOMAIN=${ROOT_DOMAIN}
    ## Creating CA-Signed Certificates for Your Dev Sites

    # Now that we’re a CA on all our devices, we can sign certificates for any new dev sites that need HTTPS.
    ## First, we create a private key:
    openssl genrsa -out ${CERTS_DIR}/localhost.${ROOT_DOMAIN}.key 4096

    ## Then we create a CSR:
    openssl req -new -key ./certs/localhost.${ROOT_DOMAIN}.key -out ./certs/localhost.${ROOT_DOMAIN}.csr -subj "/emailAddress=noreply@zapdaz.com/CN=*.$@/O=zapdaz/OU=Development/C=US/ST=Mississippi/L=Starkville"

    local newFileName="${CERTS_DIR}/localhost.${ROOT_DOMAIN}.ext"
cat > ${newFileName} <<EOL
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost.${ROOT_DOMAIN}
EOL

    # Now we run the command to create the certificate
    openssl x509 -req -in ${CERTS_DIR}/localhost.${ROOT_DOMAIN}.csr -CA ${CA_CERTS_DIR}/my-certificate-authority.pem -CAkey ${CA_CERTS_DIR}/my-certificate-authority.key -CAcreateserial -out ${CERTS_DIR}/localhost.${ROOT_DOMAIN}.crt -days 825 -sha256 -extfile ${CERTS_DIR}/localhost.${ROOT_DOMAIN}.ext

    # Copy the localhost.zapdaz.com.crt, and *.key to appropriate project
fi
