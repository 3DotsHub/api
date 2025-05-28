import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { StorjClient } from 'storj/storj.client.service';

@Module({
	providers: [PartnerService, StorjClient],
	controllers: [PartnerController],
	exports: [],
})
export class PartnerModule {}
