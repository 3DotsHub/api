import { SubscriptionGroups } from './dtos/groups.dto';

export type TelegramState = {
	startup: number;
};

export type TelegramGroupState = {
	apiVersion: string;
	createdAt: number;
	updatedAt: number;
	groups: string[];
	ignore: string[];
	subscription: {
		[key: string]: SubscriptionGroups;
	};
};
