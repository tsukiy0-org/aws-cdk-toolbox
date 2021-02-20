import {
  Function as LambdaFunction,
  FunctionProps,
  Runtime
} from "@aws-cdk/aws-lambda";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { Construct, Duration } from "@aws-cdk/core";

export class JsFunction extends LambdaFunction {
  constructor(
    scope: Construct,
    id: string,
    props: Pick<FunctionProps, "code" | "handler"> & Partial<FunctionProps>
  ) {
    super(scope, id, {
      code: props.code,
      handler: props.handler,
      runtime: Runtime.NODEJS_12_X,
      memorySize: 128,
      logRetention: RetentionDays.ONE_DAY,
      retryAttempts: 0,
      timeout: Duration.seconds(30)
    });
  }
}
