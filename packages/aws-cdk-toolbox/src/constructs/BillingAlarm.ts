import { Construct, Duration } from "@aws-cdk/core";
import {
  ComparisonOperator,
  IAlarmAction,
  Metric,
} from "@aws-cdk/aws-cloudwatch";

export class BillingAlarm extends Construct {
  public constructor(
    scope: Construct,
    id: string,
    props: {
      amountUSD: number;
      actions: IAlarmAction[];
    },
  ) {
    super(scope, id);

    const metric = new Metric({
      metricName: "EstimatedCharges",
      namespace: "AWS/Billing",
      period: Duration.hours(6),
      statistic: "Maximum",
      dimensions: {
        Currency: "USD",
      },
    });

    const alarm = metric.createAlarm(scope, `Alarm`, {
      alarmName: `Billing (>= ${props.amountUSD}USD)`,
      threshold: props.amountUSD,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    alarm.addAlarmAction(...props.actions);
  }
}
