import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs"; // Import Construct from 'constructs'

export class MyEc2InstanceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the VPC
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3,
      natGateways: 1,
    });

    // Create a new role
    const role = new iam.Role(this, "MyInstanceRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    // Attach ManagedPolicy to the Role
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess")
    );

    // Define the EC2 instance
    const instance = new ec2.Instance(this, "MyInstance", {
      vpc,
      role: role, // Attach the Role to the EC2 instance
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MEDIUM
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: "aisampleKey",
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      blockDevices: [
        // Add EBS Volume of 20GB
        {
          deviceName: "/dev/sda1",
          volume: ec2.BlockDeviceVolume.ebs(20),
        },
      ],
    });

    // Allow SSH access from anywhere
    instance.connections.allowFromAnyIpv4(
      ec2.Port.tcp(22),
      "Allow SSH from anywhere"
    );

    // Create a rule that runs every day at 18:00 UTC
    const rule = new events.Rule(this, "Rule", {
      schedule: events.Schedule.cron({ minute: "0", hour: "18" }),
    });

    // Add a target to the rule that stops the EC2 instance
    rule.addTarget(
      new targets.AwsApi({
        service: "EC2",
        action: "stopInstances",
        parameters: {
          InstanceIds: [instance.instanceId],
        },
        policyStatement: new iam.PolicyStatement({
          actions: ["ec2:StopInstances"],
          resources: ["*"],
        }),
      })
    );
  }
}
