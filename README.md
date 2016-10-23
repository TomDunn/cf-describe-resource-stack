# Inspect a Lambda's CloudFormation Stack

Helps [Lambda Functions][1] resolve dynamic configuration values such as the names of other resources in their [CloudFormation][2] stack.

Lambda functions do not currently support custom configuration variables (like ENV vars) so this makes it difficult to inject stage specific configuration variables. For example - the INTEGRATION stage of my Lambda function should use the INTEGRATION version of my DynamoDB table.

This module helps with that problem by using CloudFormation APIs to look up the other resources that belong to the same stack of the Lambda Function - in this way a Lambda function can discover resources using the logical IDs they were assigned in CloudFormation. It also provides access to the Stack Parameters and Stack Outputs.

This module assumes that it is being used by a Lambda Function that is managed by CloudFormation - it will not work otherwise.

## Installation

```sh
npm install --save lambda-cf-stack-inspection
```

## Usage

### Setting up the module

```javascript
const AWS = require('aws-sdk');
// configure the AWS SDK if needed, for example by setting the region
AWS.config.update({region: 'us-east-1'});

// requiring the module returns a factory function which takes the configued AWS SDK object
const cfUtil = require('lambda-cf-stack-inspection')(AWS);
```
### Using

```javascript
// CloudFormation has a concept of a physical resource ID. For the Lambda Functions this is the function name
// Here physicalResourceId could come from process.env.AWS_LAMBDA_FUNCTION_NAME
cfUtil.getStackDescriptionForResource(physicalResourceId).then(stackInfo => {
  stackInfo.resources(); // returns an array of CloudFormation resources in the stack
  stackInfo.resourcesByType(); // returns an object with structure: CloudFormationResourceType => [resources]
  stackInfo.resourcesByLogicalId(); // returns an object keyed by the LogicalId of the resources
  stackInfo.stackParameters(); // returns the stack parameters
  stackInfo.stackOutputs(); // returns the Outputs of the stack
});
```

[1]: https://aws.amazon.com/lambda/
[2]: https://aws.amazon.com/cloudformation/
