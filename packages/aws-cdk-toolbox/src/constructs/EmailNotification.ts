import { Construct } from "@aws-cdk/core";
import { Topic } from "@aws-cdk/aws-sns";
import { EmailSubscription } from "@aws-cdk/aws-sns-subscriptions";
import { IAlarmAction } from "@aws-cdk/aws-cloudwatch";
import { SnsAction } from "@aws-cdk/aws-cloudwatch-actions";

export class EmailNotification extends Construct {
  public readonly action: IAlarmAction;

  public constructor(
    scope: Construct,
    id: string,
    props: {
      emails: string[];
    },
  ) {
    super(scope, id);

    const topic = new Topic(scope, "Topic", {});
    props.emails.forEach((email) =>
      topic.addSubscription(new EmailSubscription(email)),
    );

    const action = new SnsAction(topic);

    this.action = action;
  }
}
