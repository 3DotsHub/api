import { Injectable, Logger } from '@nestjs/common';
import { Message, Ollama } from 'ollama';

@Injectable()
export class OllamaClient extends Ollama {
	private readonly logger = new Logger(this.constructor.name);

	constructor() {
		// if (!process.env.STORJ_ACCESSKEY) throw new Error('STORJ_ACCESSKEY not available');

		super({
			host: 'http://127.0.0.1:11434',
		});

		setTimeout(async () => await this.getInfo(), 500);
		setTimeout(async () => await this.getInfo(), 800);
	}

	async getInfo() {
		const { models } = await this.list();
		models.forEach((m) => console.log(m.model));

		const message: Message = {
			role: 'user',
			content: 'how to use an embedding  vector data base in nestjs',
		};

		const chat = await this.chat({
			model: 'qwen2.5-coder:1.5b-base',
			stream: false,
			messages: [message],
		});
		console.log({ chat });
	}
}
