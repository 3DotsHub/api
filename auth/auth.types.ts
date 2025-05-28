import { Address, Hex } from 'viem';
import { Role } from './roles.types';

export type CreateMessageOptions = {
	address: Address;
	valid?: number;
	expired?: number;
};

export type SignInOptions = {
	message: string;
	signature: string | Hex;
};

export type AuthPayload = {
	address: Address;
};

export type AuthAccessToken = {
	accessToken: string;
};

export interface AuthenticatedRequest extends Request {
	user?: AuthPayload;
}

export type AuthPermissionState = {
	apiVersion: string;
	createdAt: number;
	updatedAt: number;
	roles: { [key: Address]: Role[] }; // mapped roles
	partner: { [key: Address]: number[] }; // mapped partner ids
};
