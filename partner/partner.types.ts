import { Address } from 'viem';

export type Partner = PartnerPerson | PartnerCompany;

export type PartnerPerson = {
	firstName: string;
	lastName: string;
	email: string;
	address: PartnerAddress;
};

export type PartnerCompany = {
	companyName: string;
	email: string;
	address: PartnerAddress;
};

export type PartnerAddress = {
	street: string;
	number: string;
	additional?: string;
	zipcode: string;
	city: string;
	country: string;
};

export type Permission = {
	read: Address[];
	write: Address[];
};

export type PartnerDetails = {
	id: number;
	createdAt: number;
	updatedAt: number;
	partner: Partner;
	permission: Permission;
	pending?: boolean;
	verified?: boolean;
	locked?: boolean;
};

export type PartnerListState = {
	apiVersion: string;
	createdAt: number;
	updatedAt: number;
	partners: PartnerDetails[];
};
