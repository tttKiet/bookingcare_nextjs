import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_AWS_S3 || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY_AWS_S3 || "",
  },
  region: process.env.NEXT_PUBLIC_REGION_AWS_S3,
});

export { s3 };
