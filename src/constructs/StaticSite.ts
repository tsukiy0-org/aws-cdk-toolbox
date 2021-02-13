import { Construct, Duration, RemovalPolicy } from "@aws-cdk/core";
import { Bucket, IBucket } from "@aws-cdk/aws-s3";
import { BucketDeployment, ISource } from "@aws-cdk/aws-s3-deployment";
import {
  CloudFrontWebDistribution,
  IDistribution,
  OriginProtocolPolicy,
  ViewerCertificate,
} from "@aws-cdk/aws-cloudfront";
import {
  Certificate,
  CertificateValidation,
} from "@aws-cdk/aws-certificatemanager";

export class StaticSite extends Construct {
  public readonly bucket: IBucket;

  public readonly cdn: IDistribution;

  constructor(
    scope: Construct,
    id: string,
    props: {
      domainName: string;
      source: ISource;
      noCachePathPatterns: string[];
    },
  ) {
    super(scope, id);

    const bucket = new Bucket(this, "Bucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      sources: [props.source],
    });

    const certificate = new Certificate(this, "Certificate", {
      domainName: props.domainName,
      validation: CertificateValidation.fromDns(),
    });

    const cdn = new CloudFrontWebDistribution(this, "CloudFront", {
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [props.domainName],
      }),
      originConfigs: [
        {
          customOriginSource: {
            domainName: bucket.bucketWebsiteDomainName,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
            ...props.noCachePathPatterns.map((pathPattern) => {
              return {
                pathPattern,
                defaultTtl: Duration.minutes(0),
                minTtl: Duration.minutes(0),
                maxTtl: Duration.minutes(0),
              };
            }),
          ],
        },
      ],
    });

    this.bucket = bucket;
    this.cdn = cdn;
  }
}
