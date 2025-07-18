import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3ServiceInterface } from '../../../app/providers/s3.service.interface';
import { awsConfig } from '../../../infra/config/aws.config';

export class S3Service implements S3ServiceInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly urlExpirationTime = 3600; // 1 hour in seconds

  constructor() {
    if (!awsConfig.bucketName) {
      throw new Error('AWS bucket name is required');
    }
    this.bucketName = awsConfig.bucketName;
    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: awsConfig.credentials,
    });
  }

  async generatePresignedUrl(fileName: string, fileType: string): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }> {
    const key = `uploads/${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpirationTime,
    });

    const fileUrl = `https://${this.bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;

    return {
      uploadUrl,
      fileUrl,
    };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error("Failed to delete file from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }
} 