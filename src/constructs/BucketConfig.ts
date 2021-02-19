import { Construct, CustomResource, Duration } from "@aws-cdk/core";
import { Code, Function as LambdaFunction, Runtime } from "@aws-cdk/aws-lambda";
import { Provider } from "@aws-cdk/custom-resources";
import { IBucket } from "@aws-cdk/aws-s3";
import * as uuid from "uuid";

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

    const onEventFn = new LambdaFunction(this, "OnEventFunction", {
      code: Code.fromInline(`
const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const work = async () => {
    const s3 = new AWS.S3();
    const { BUCKET_NAME, RANDOM_SEED, ...rest } = event.ResourceProperties;

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
      memorySize: 128,
      timeout
    });
    props.bucket.grantWrite(onEventFn);

    const onCompleteFn = new LambdaFunction(this, "OnCompleteFunction", {
      code: Code.fromInline(`
exports.handler = async () => {
  return {
    IsComplete: true
  }; 
}
      `),
      runtime: Runtime.NODEJS_12_X,
      handler: "index.handler",
      memorySize: 128,
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
        RANDOM_SEED: uuid.v4(),
        BUCKET_NAME: props.bucket.bucketName,
        ...props.config
      }
    });
  }
}
