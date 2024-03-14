#!/bin/bash

# Check for AWS CLI
if ! command -v aws &> /dev/null
then
    echo "AWS CLI not found. Please install it and try again."
    exit 1
fi

# Check for agent.cf.json file
if [ ! -f "$(pwd)/agent.cf.json" ]
then
    echo "agent.cf.json file not found. Please make sure it exists and try again."
    exit 1
fi

set -e

aws cloudformation create-stack \
--stack-name agent \
--template-body file://"$(pwd)"/agent.cf.json \
--capabilities CAPABILITY_NAMED_IAM \
--region us-west-2 \
--timeout-in-minutes 10 \
--profile my-aws-profile
