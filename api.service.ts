import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { VIEM_CONFIG } from 'api.config';
import { TelegramService } from 'telegram/telegram.service';

@Injectable()
export class ApiService {
	private readonly logger = new Logger(this.constructor.name);
	private fetchedBlockheight: number = 0;

	constructor(private readonly telegram: TelegramService) {
		setTimeout(() => this.updateBlockheight(), 100);
	}

	async updateWorkflow() {
		this.logger.log(`Fetched blockheight: ${this.fetchedBlockheight}`);
		const promises = [this.telegram.updateTelegram()];

		return Promise.all(promises);
	}

	@Interval(5_000)
	async updateBlockheight() {
		const tmp: number = parseInt((await VIEM_CONFIG.getBlockNumber()).toString());
		if (tmp > this.fetchedBlockheight) {
			this.fetchedBlockheight = tmp;
			await this.updateWorkflow();
		}
	}
}
