import { Module } from '@nestjs/common';
import { StorjClient } from './storj.client.service';
import { StorjUploadController } from './storj.upload.controller';

@Module({
	providers: [StorjClient],
	controllers: [StorjUploadController],
	exports: [StorjClient],
})
export class StorjModule {}
