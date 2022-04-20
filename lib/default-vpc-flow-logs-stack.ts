import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as iam from "@aws-cdk/aws-iam"; //flowlogs
import * as logs from '@aws-cdk/aws-logs'; //flowlogs

export class DefaultVpcFlowLogsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // or create the cloud9 environment in the default VPC with specific instanceType
    const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', {
      isDefault: true,
      //Tags.of(defaultVpc).add('Name', 'my-cdk-default-vpc'),
    });

    // 👇 update the Name tag for the VPC
    //Tags.of(defaultVpc).add('Name', 'my-cdk-default-vpc');
    //cdk.Aspects.of(defaultVpc).add(new cdk.Tag('Name', 'my-cdk-default-vpc'));
    cdk.Tags.of(defaultVpc).add('Name', 'my-cdk-default-vpc', {
      //includeResourceTypes: ['AWS::DynamoDB::Table'],
    });

    // VPC Flow Logs
    const logGroup = new logs.LogGroup(this, 'MyCustomLogGroup-default-vpc', {
      retention: logs.RetentionDays.ONE_YEAR,
    });

    cdk.Tags.of(logGroup).add('Name', 'default-vpc-log-group', {
    });

    const iamRoleFlowLogs = new iam.Role(this, 'flow-log-role-default-vpc', {
      assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com')
    });

    new ec2.FlowLog(this, 'FlowLog-default-vpc', {
      resourceType: ec2.FlowLogResourceType.fromVpc(defaultVpc),
      destination: ec2.FlowLogDestination.toCloudWatchLogs(logGroup, iamRoleFlowLogs)
    });

    new cdk.CfnOutput(this, 'vpcId', {
      value: defaultVpc.vpcId,
      description: 'the ID of the default VPC',
    });
  }
}
