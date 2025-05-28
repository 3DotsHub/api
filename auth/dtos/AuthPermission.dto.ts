import { Role } from 'auth/roles.enum';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { Address } from 'viem';

export class AuthPermissionDto {
	constructor() {
		this.apiVersion = '';
		this.createdAt = 0;
		this.updatedAt = 0;
		this.roles = {};
		this.partner = {};
	}

	@IsString()
	apiVersion: string;

	@IsNumber()
	createdAt: number;

	@IsNumber()
	updatedAt: number;

	@IsObject()
	roles?: { [key: Address]: Role[] };

	@IsObject()
	partner?: { [key: Address]: number[] };
}
