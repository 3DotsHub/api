import { Module } from '@nestjs/common';
import { OllamaClient } from './ollama.client.service';

@Module({
	providers: [OllamaClient],
	controllers: [],
	exports: [OllamaClient],
})
export class OllamaModule {}
