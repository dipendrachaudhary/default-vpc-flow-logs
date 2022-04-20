#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import {DefaultVpcFlowLogsStack} from '../lib/default-vpc-flow-logs-stack';

const app = new cdk.App();
new DefaultVpcFlowLogsStack(app, 'defaut-vpc-flow-logs', {
  stackName: 'default-vpc-flow-logs',
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
