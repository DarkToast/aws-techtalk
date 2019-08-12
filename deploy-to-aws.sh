#!/bin/sh
set -eux

S3_BUCKET=$1
STAGE=$2

sam build -m package.json -t template.yaml
sam package --s3-bucket ${S3_BUCKET} --output-template-file packaged.yaml
sam deploy --template-file ./packaged.yaml \
    --stack-name ${STAGE}-techtalk \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Stage=${STAGE}