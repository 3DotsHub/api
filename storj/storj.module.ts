import { Module } from '@nestjs/common';
import { StorjClient } from './storj.client.service';

@Module({
	providers: [StorjClient],
	controllers: [],
	exports: [StorjClient],
})
export class StorjModule {}
