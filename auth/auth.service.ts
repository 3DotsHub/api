import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Address, isAddress, isHex, zeroAddress } from 'viem';
import { WalletService } from 'wallet/wallet.service';
import { AuthAccessToken, AuthPayload, AuthPermissionState, CreateMessageOptions, SignInOptions } from './auth.types';
import { formatMinutes } from 'utils/format';
import { StorjClient } from 'storj/storj.client.service';
import { AuthPermissionDto } from './dtos/AuthPermission.dto';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(this.constructor.name);
	private readonly storjPath: string = '/auth.permission.json';
	private permission: AuthPermissionState;

	constructor(
		private readonly storj: StorjClient,
		private readonly wallet: WalletService,
		private jwtService: JwtService
	) {
		const time: number = Date.now();
		this.permission = {
			apiVersion: process.env.npm_package_version,
			createdAt: time,
			updatedAt: time,
			roles: {},
			partner: {},
		};

		this.readState();
	}

	async readState() {
		this.logger.log(`Reading backup...`);
		const response = await this.storj.read(this.storjPath, AuthPermissionDto);

		if (response.messageError || response.validationError.length > 0) {
			this.logger.error(response.messageError);
			this.logger.log(`New state created.`);
		} else {
			this.permission = {
				...this.permission,
				...response.data,
			};
			this.logger.log(`State restored.`);
		}
	}

	async writeState() {
		this.permission.apiVersion = process.env.npm_package_version;
		this.permission.updatedAt = Date.now();
		const response = await this.storj.write(this.storjPath, this.permission);
		const httpStatusCode = response['$metadata'].httpStatusCode;
		if (httpStatusCode == 200) {
			this.logger.log(`State backup stored.`);
		} else {
			this.logger.error(`State backup failed. httpStatusCode: ${httpStatusCode}`);
		}
		return httpStatusCode;
	}

	getScope(address: Address) {
		const key = address.toLowerCase() as Address;
		return {
			roles: this.permission.roles[key],
			partner: this.permission.partner[key],
		};
	}

	createMessage({ address, valid, expired }: CreateMessageOptions) {
		const now = Date.now();

		// input validation
		if (valid == undefined || valid < now) valid = now;
		if (expired == undefined || expired < now) expired = now + formatMinutes(10);

		// return message to sign
		return `Signing this message confirms your control over the wallet address: ${address} valid: ${valid} expired: ${expired}`;
	}

	async signIn({ message, signature }: SignInOptions): Promise<AuthAccessToken | { error: string }> {
		// verify message input
		const messageSplit = message.split(' ');
		const findAddress = messageSplit.findIndex((i) => i == 'address:');
		const findValid = messageSplit.findIndex((i) => i == 'valid:');
		const findExpired = messageSplit.findIndex((i) => i == 'expired:');

		if ([findAddress, findValid, findExpired].includes(-1)) throw new BadRequestException('Property is missing in message');

		const input = {
			address: messageSplit.at(findAddress + 1),
			valid: Number(messageSplit.at(findValid + 1)),
			expired: Number(messageSplit.at(findExpired + 1)),
		};

		if (!isAddress(input.address) || input.address == zeroAddress) throw new BadRequestException('Address is not valid');
		if (isNaN(input.valid) || input.valid > Date.now()) throw new BadRequestException('Valid timestamp is not valid');
		if (isNaN(input.expired) || input.expired < Date.now()) throw new BadRequestException('Expired timestamp is not valid');

		const messageTemplate = this.createMessage({ address: input.address }).split(' ');
		const messageOriginal = messageTemplate.slice(0, findAddress).join(' ');
		const messageParsed = messageSplit.slice(0, findAddress).join(' ');

		// verify message
		if (messageOriginal != messageParsed || messageTemplate.length != messageSplit.length)
			throw new BadRequestException('Message is not valid');

		// verify signature input
		if (!isHex(signature)) throw new BadRequestException('Signature is not hex type: 0x...');

		// verify signature
		try {
			const isValid = await this.wallet.verifySignature({
				message,
				signature,
				expectedAddress: input.address,
			});

			// is not valid?
			if (!isValid) {
				throw new BadRequestException('Signature is not valid');
			}
		} catch (e) {
			throw new BadRequestException('Signature is not valid');
		}

		// verify if address has roles
		const key = input.address.toLowerCase();
		const roles = this.permission.roles[key as Address];

		if (roles == undefined || roles.length == 0) {
			throw new BadRequestException('Address not recognized');
		}

		// create payload and return access token
		return this.signPayload({ address: input.address });
	}

	private async signPayload(payload: AuthPayload): Promise<AuthAccessToken> {
		return {
			accessToken: await this.jwtService.signAsync(payload),
		};
	}
}
