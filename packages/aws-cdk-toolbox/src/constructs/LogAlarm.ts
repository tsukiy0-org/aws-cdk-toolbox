import { Construct, Duration } from "@aws-cdk/core";
import { MetricFilter, ILogGroup, MetricFilterProps } from "@aws-cdk/aws-logs";
import { Alarm, IAlarmAction } from "@aws-cdk/aws-cloudwatch";

export class LogAlarm extends Construct {
  public constructor(
    scope: Construct,
    id: string,
    props: {
      logGroup: ILogGroup;
      actions: IAlarmAction[];
      metric: Pick<
        MetricFilterProps,
        "metricNamespace" | "metricName" | "filterPattern"
      >;
      threshold: {
        period: Duration;
        occurences: number;
      };
    },
  ) {
    super(scope, id);

    const metricFilter = new MetricFilter(this, "MetricFilter", {
      logGroup: props.logGroup,
      ...props.metric,
    });

    const metric = metricFilter.metric({
      period: props.threshold.period,
      statistic: "sum",
    });

    const alarm = new Alarm(this, "Alarm", {
      metric,
      threshold: props.threshold.occurences,
      evaluationPeriods: 1,
    });

    alarm.addAlarmAction(...props.actions);
  }
}
