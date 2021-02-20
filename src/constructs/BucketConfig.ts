import { Construct, CustomResource, Duration } from "@aws-cdk/core";
import { Code, Runtime } from "@aws-cdk/aws-lambda";
import { Provider } from "@aws-cdk/custom-resources";
import { IBucket } from "@aws-cdk/aws-s3";
import { DefaultFunction } from "./DefaultFunction";

export class BucketConfig extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      bucket: IBucket;
      config: Record<string, string>;
    }
  ) {
    super(scope, id);

    const timeout = Duration.seconds(30);

    const onEventFn = new DefaultFunction(this, "OnEventFunction", {
      code: Code.fromInline(`
const AWS = require("aws-sdk");

exports.handler = async (event) => {
  console.log(event);

  const work = async () => {
    const s3 = new AWS.S3();
    const { BUCKET_NAME, RANDOM_SEED, ServiceToken, ...rest } = event.ResourceProperties;

    await s3
      .upload({
        Bucket: BUCKET_NAME,
        Key: "config.json",
        ContentType: "application/json",
        Body: JSON.stringify(rest),
      })
      .promise();
  }

  switch (event.RequestType) {
    case "Create":
    case "Update":
      await work();
      return;
    case "Delete":
    default:
  }
}
      `),
      runtime: Runtime.NODEJS_12_X,
      handler: "index.handler",
      timeout
    });
    props.bucket.grantWrite(onEventFn);

    const onCompleteFn = new DefaultFunction(this, "OnCompleteFunction", {
      code: Code.fromInline(`
exports.handler = async () => {
  return {
    IsComplete: true
  }; 
}
      `),
      runtime: Runtime.NODEJS_12_X,
      handler: "index.handler",
      timeout
    });

    const provider = new Provider(this, "Provider", {
      onEventHandler: onEventFn,
      isCompleteHandler: onCompleteFn,
      totalTimeout: timeout
    });

    new CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      properties: {
        RANDOM_SEED: Math.floor(Math.random() * 1000000),
        BUCKET_NAME: props.bucket.bucketName,
        ...props.config
      }
    });
  }
}
