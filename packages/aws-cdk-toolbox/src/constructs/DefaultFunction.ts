import { Function as LambdaFunction, FunctionProps } from "@aws-cdk/aws-lambda";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { Construct, Duration } from "@aws-cdk/core";

export class DefaultFunction extends LambdaFunction {
  constructor(
    scope: Construct,
    id: string,
    props: Pick<FunctionProps, "code" | "handler" | "runtime"> &
      Partial<FunctionProps>,
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
