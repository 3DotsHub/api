// CORE IMPORTS
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

// IMPORTS
import { ApiService } from 'api.service';
import { TelegramService } from 'telegram/telegram.service';
import { DockerModule } from './docker/docker.module';
import { AuthModule } from 'auth/auth.module';
import { WalletModule } from 'wallet/wallet.module';
import { StorjModule } from 'storj/storj.module';
import { OllamaModule } from 'ollama/ollama.module';

// APP MODULE
@Module({
	imports: [
		ConfigModule.forRoot(),
		ScheduleModule.forRoot(),
		AuthModule,
		WalletModule,
		DockerModule,
		StorjModule,
		OllamaModule,
	],
	// controllers: [

	// ],
	providers: [TelegramService, ApiService],
})
export class AppModule {}
