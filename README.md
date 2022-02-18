# Serverless Facebook Messenger Bot in Node.js and AWS

## Introduction

This example app will run on top of AWS serverless services such as:

- AWS DynamoDb
- AWS Lambda
- AWS REST API Gateway

The IaS (Infrastructure as Code) `.yml` file has been provided to help you deploying any necessary resources to run the application.

## What you can do with this app

- Say hi to initiate the chat bot app
- Get any messages on REST API
  - /messages
  - /messages/:msg_id
  - /summary
- Deploying serverless based app

## How to deploy

### Prerequisite

You need to create Business Page on Facebook to be integrate with messenger.
Also read this external resources for preparing your own integration and deployment :

- [FB-Messenger for developer](https://developers.facebook.com/docs/messenger-platform/getting-started)
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [AWS Cloudformation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)

Make sure your choice of AWS Regions support any of this services:

- AWS DynamoDb
- AWS Lambda
- AWS REST API Gateway
- AWS Elastic IP

### Requirement

- NodeJs version >= 12.x.x
- Facebook webhook version 13.0
- Facebook developer account
- AWS Account
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM installed](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)

### Apps and serverless resources deployment

1. Put `WEBHOOK_VERIFY_TOKEN` env of your choice on serverless.yml
2. Put FB-Messenger `PAGE_ACCESS_TOKEN` env on serverless.yml
3. RUN `sam build -t serverless.yml` on projects root folder
4. RUN `sam deploy -t serverless.yml --guided` on projects root folder
   - enter stack name of your choice (ex: bot-test-app)
   - enter `ap-southeast-1` for AWS regions
   - choose `N` for Confirm changes before deploy ?
   - choose `Y` for Allow SAM CLI IAM role creation
   - choose `N` for Disable rollback
   - choose `Y` for Save arguments to configuration file
   - choose default name for SAM configuration file [samconfig.toml]
   - choose default name enter for SAM configuration environment [default]
5. Notes the Cloudformation output value of `endpointApi` when successfully finished SAM deployment as your REST API base URL
6. Add the URL from point 5 as callback URL on FB-Messenger for developer setup page
   - Add `/webhook` path to base URL (ex: https://BASE_URL/webhook)
7. Go to the FB-Page you created before and say hi on chat

### How to clean-up

1. RUN `sam delete -t serverless.yml` on projects root folder
2. Choose `Y` for the remaining options
3. Go to AWS console to manually release elastic IP on VPC menu --> Elastic IP submenu

Notes: AWS Cloudformation will not automatically release unused Elastic IP so you have to do it manually to avoid any unnecessary billing.

### Cheers!
