import { Construct } from "@aws-cdk/core";
import { IFunction } from "@aws-cdk/aws-lambda";
import {
  Certificate,
  CertificateValidation,
} from "@aws-cdk/aws-certificatemanager";
import { LambdaRestApi, Cors } from "@aws-cdk/aws-apigateway";

export class FunctionApi extends Construct {
  public readonly url: string;

  public constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      domainName?: string;
    },
  ) {
    super(scope, id);

    const api = new LambdaRestApi(this, "Api", {
      handler: props.fn,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    if (props.domainName) {
      this.addDomain(api, props.domainName);
    }

    this.url = api.url;
  }

  private addDomain = (api: LambdaRestApi, domainName: string) => {
    const certificate = new Certificate(this, "Certificate", {
      domainName: domainName,
      validation: CertificateValidation.fromDns(),
    });

    api.addDomainName("Domain", {
      domainName,
      certificate,
    });
  };
}
