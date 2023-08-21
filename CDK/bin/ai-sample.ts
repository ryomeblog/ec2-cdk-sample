#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyEc2InstanceStack } from '../lib/my_ec2_instance-stack';

const app = new cdk.App();
new MyEc2InstanceStack(app, 'MyEc2InstanceStack');