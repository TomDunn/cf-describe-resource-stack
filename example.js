'use strict';

const AWS       = require('aws-sdk');
const argv      = require('yargs')
    .usage('Usage: $0 --resourceId [awsPhysicalResourceId] --region [awsRegion]')
    .demand(['resourceId'])
    .default('region', 'us-east-1')
    .argv;

// configure the AWS SDK with a region
AWS.config.region = argv.region;

// the code should have access somehow to AWS credentials - for Lambda this happens automatically 
// because the Lambda function is assigned an IAM role. Ensure that the Lambda IAM role has permissions
// to call describeStackResources and describeStacks for the CloudFormation stack it belongs to.

// build the CF description helper
const cfUtil = require('./index')(AWS);

// simple print helper
const print = obj => console.log(JSON.stringify(obj, null, 2));

cfUtil.getStackDescriptionForResource(argv.resourceId).then(result => {
    const r = result;

    print(r.resources());
    print(r.resourcesByType());
    print(r.resourcesByLogicalId());
    print(r.stackParameters());
    print(r.stackOutputs());
}).catch(err => {
    console.log(err);
    console.log(err.stack);
    process.exit(1);
});
