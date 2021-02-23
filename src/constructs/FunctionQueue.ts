import { Construct, Duration } from "@aws-cdk/core";
import { IFunction } from "@aws-cdk/aws-lambda";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { IQueue, Queue } from "@aws-cdk/aws-sqs";

export class FunctionQueue extends Construct {
  public readonly queue: IQueue;

  constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      timeout: Duration;
      batchSize: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      maxReceiveCount: number;
    }
  ) {
    super(scope, id);

    // https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
    const queue = new Queue(this, "Queue", {
      visibilityTimeout: Duration.millis(6 * props.timeout.toMilliseconds()),
      deadLetterQueue: {
        queue: new Queue(this, "DeadLetterQueue"),
        maxReceiveCount: props.maxReceiveCount
      }
    });

    const source = new SqsEventSource(queue, {
      batchSize: props.batchSize
    });

    props.fn.addEventSource(source);

    this.queue = queue;
  }
}
