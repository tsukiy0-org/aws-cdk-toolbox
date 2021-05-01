import {
  DockerImageFunction,
  DockerImageFunctionProps,
} from "@aws-cdk/aws-lambda";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { Construct, Duration } from "@aws-cdk/core";

export class DefaultDockerFunction extends DockerImageFunction {
  constructor(
    scope: Construct,
    id: string,
    props: Pick<DockerImageFunctionProps, "code"> &
      Partial<DockerImageFunctionProps>,
  ) {
    super(scope, id, {
      memorySize: 128,
      timeout: Duration.seconds(30),
      logRetention: RetentionDays.ONE_WEEK,
      retryAttempts: 0,
      ...props,
    });
  }
}
