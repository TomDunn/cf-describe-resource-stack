'use strict';

const chai     = require('chai');
const assert   = chai.assert;
const si       = require('sinon');
const jsonfile = require('jsonfile');
const factory  = require('./index');

function sdkPromise(val) {
    return {promise: () => Promise.resolve(val)};
}

describe('Tests for main module', () => {
    let underTest, sdkStub, resources, stack, physicalResourceId, sdk, input;

    beforeEach(() => {

        sdk = {
            CloudFormation: function() {
                this.describeStackResources = si.stub();
                this.describeStacks         = si.stub();
                sdkStub = this;
            }
        };

        resources = jsonfile.readFileSync('./test_data/describe-stack-resources-response.json');
        stack     = jsonfile.readFileSync('./test_data/describe-stack-response.json');
        physicalResourceId = 'someResourceId';
        input = {PhysicalResourceId: physicalResourceId};
        underTest = factory(sdk);
    });

    describe('getStackDescriptionForResource(physicalResourceId)', () => {

        beforeEach(() => {
            sdkStub.describeStackResources.returns(sdkPromise(resources));
            sdkStub.describeStacks.returns(sdkPromise(stack));
        });

        describe('resources()', () => {
            it('should return the resource list as returned by AWS SDK', () => {
                return underTest.getStackDescriptionForResource(physicalResourceId).then(result => {
                    assert.equal(result.resources(), resources.StackResources);
                });
            });
        });

        describe('resourcesByType()', () => {
            it('should return the resources grouped by type', () => {
                return underTest.getStackDescriptionForResource(physicalResourceId).then(result => {
                    assert.deepEqual(result.resourcesByType(), {
                        "AWS::DynamoDB::Table": [
                            {LogicalResourceId: "DynamoDBTable",  ResourceType: "AWS::DynamoDB::Table"},
                            {LogicalResourceId: "DynamoDBTable2", ResourceType: "AWS::DynamoDB::Table"}
                        ],

                        "AWS::Lambda::Function": [
                            {LogicalResourceId: "LambdaFunc", ResourceType: "AWS::Lambda::Function"}
                        ]
                    });
                });
            });
        });

        describe('resourcesByLogicalId()', () => {
            it('should return the resources by logical resource id', () => {
                return underTest.getStackDescriptionForResource(physicalResourceId).then(result => {
                    assert.deepEqual(result.resourcesByLogicalId(), {
                        LambdaFunc: {
                            LogicalResourceId: 'LambdaFunc',
                            ResourceType: 'AWS::Lambda::Function'
                        },
                        DynamoDBTable: {
                            LogicalResourceId: 'DynamoDBTable',
                            ResourceType: 'AWS::DynamoDB::Table'
                        },
                        DynamoDBTable2: {
                            LogicalResourceId: 'DynamoDBTable2',
                            ResourceType: 'AWS::DynamoDB::Table'
                        }
                    });
                });
            });
        });

        describe('stackParameters()', () => {
            it('should return the parameters for the stack', () => {
                return underTest.getStackDescriptionForResource(physicalResourceId).then(result => {
                    assert.deepEqual(result.stackParameters(), {
                        Name: "Foo",
                        SomeKeyName: "SomeKeyVal"
                    });
                });
            });
        });

        describe('stackOutputs()', () => {
            it('should return the outputs of the stack', () => {
                return underTest.getStackDescriptionForResource(physicalResourceId).then(result => {
                    assert.deepEqual(result.stackOutputs(), {
                        SomeOutputKey: "SomeOutputVal"
                    });
                });
            });
        });
    });
});
