import { Injectable, Logger } from '@nestjs/common';
import { StorjClient } from 'storj/storj.client.service';
import { PartnerDetails, PartnerListState } from './partner.types';
import { PartnersDTO } from './dtos/partners.dto';

@Injectable()
export class PartnerService {
	private readonly logger = new Logger(this.constructor.name);
	private readonly storjPath: string = '/partner.list.json';
	private partnerState: PartnerListState;

	constructor(private readonly storj: StorjClient) {
		const time: number = Date.now();
		this.partnerState = {
			apiVersion: process.env.npm_package_version,
			createdAt: time,
			updatedAt: time,
			partners: [],
		};

		this.readState();
	}

	async readState() {
		this.logger.log(`Reading backup groups from storj`);
		const response = await this.storj.read(this.storjPath, PartnersDTO);

		if (response.messageError || response.validationError.length > 0) {
			this.logger.error(response.messageError);
			this.logger.log(`Partners state created...`);
		} else {
			this.partnerState = {
				...this.partnerState,
				...response.data,
			};
			this.logger.log(`Partners state restored...`);
		}
	}

	async writeState() {
		this.partnerState.apiVersion = process.env.npm_package_version;
		this.partnerState.updatedAt = Date.now();
		const response = await this.storj.write(this.storjPath, this.partnerState);
		const httpStatusCode = response['$metadata'].httpStatusCode;
		if (httpStatusCode == 200) {
			this.logger.log(`Partners state backup stored`);
		} else {
			this.logger.error(`Partners state backup failed. httpStatusCode: ${httpStatusCode}`);
		}
		return httpStatusCode;
	}

	list() {
		return this.partnerState.partners;
	}

	async create(partner: PartnerDetails) {
		this.partnerState.partners.push(partner);
		return this.writeState();
	}

	async update(partner: PartnerDetails) {
		const idx = this.partnerState.partners.findIndex((i) => i.id == partner.id);
		if (idx == undefined) return this.create(partner);
		this.partnerState.partners[idx] = partner;
		return this.writeState();
	}
}
