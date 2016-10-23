# Inspect a Lambda's CloudFormation Stack

Helps [Lambda Functions][1] resolve dynamic configuration values such as the names of other resources in their [CloudFormation][2] stack.

Lambda functions do not currently support custom configuration variables (like ENV vars) so this makes it difficult to inject stage specific configuration variables. For example - the INTEGRATION stage of my Lambda function should use the INTEGRATION version of my DynamoDB table.

This module helps with that problem by using CloudFormation APIs to look up the other resources that belong to the same stack of the Lambda Function - in this way a Lambda function can discover resources using the logical IDs they were assigned in CloudFormation. It also provides access to the Stack Parameters and Stack Outputs.

This module assumes that it is being used by a Lambda Function that is managed by CloudFormation - it will not work otherwise.

## Installation

TODO - not imported into NPM yet.

## Usage

TODO

## Example with Lambda

[1]: https://aws.amazon.com/lambda/
[2]: https://aws.amazon.com/cloudformation/
