import { IsArray, IsString, IsNumber, IsOptional } from 'class-validator';
import { PartnerDetails } from 'partner/partner.types';

export class PartnersDTO {
	constructor() {
		this.apiVersion = '';
		this.createdAt = 0;
		this.updatedAt = 0;
		this.partners = [];
	}

	@IsString()
	apiVersion: string;

	@IsNumber()
	createdAt: number;

	@IsNumber()
	updatedAt: number;

	@IsOptional() // @dev: for backwards compatible states
	@IsArray()
	partners?: PartnerDetails[];
}
