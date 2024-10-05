import { Injectable, Logger, ValidationError } from '@nestjs/common';
import { GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class Storj extends S3Client {
	private readonly logger = new Logger(this.constructor.name);
	readonly bucket: string;

	constructor() {
		if (!process.env.STORJ_ACCESSKEY) throw new Error('STORJ_ACCESSKEY not available');
		if (!process.env.STORJ_SECRETACCESSKEY) throw new Error('STORJ_SECRETACCESSKEY not available');
		if (!process.env.STORJ_BUCKET) throw new Error('STORJ_BUCKET not available');

		super({
			region: process.env.STORJ_REGION || 'EU1',
			endpoint: process.env.STORJ_ENDPOINT || 'https://gateway.storjshare.io',
			credentials: {
				accessKeyId: process.env.STORJ_ACCESSKEY,
				secretAccessKey: process.env.STORJ_SECRETACCESSKEY,
			},
		});

		this.bucket = process.env.STORJ_BUCKET;
	}

	async write(key: string, data: any): Promise<PutObjectCommandOutput> {
		const cmd = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: JSON.stringify(data),
		});

		try {
			return await this.send(cmd);
		} catch (error) {
			return error;
		}
	}

	async read<T extends object>(
		key: string,
		dtoClassConstructor?: ClassConstructor<T>
	): Promise<{ data: T; validationError: ValidationError[]; messageError: string }> {
		const cmd = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		try {
			const response: GetObjectCommandOutput = await this.send(cmd);
			const body = JSON.parse(await response.Body.transformToString());
			const dto = plainToInstance<T, typeof body>(dtoClassConstructor, body);
			const validationError = dtoClassConstructor ? await validate(dto) : [];

			return {
				data: dto,
				validationError,
				messageError: '',
			};
		} catch (error) {
			return {
				data: new dtoClassConstructor(),
				validationError: [],
				messageError: error?.Code || error?.code || error?.message,
			};
		}
	}
}
