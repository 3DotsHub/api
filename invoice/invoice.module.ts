import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';

@Module({
	providers: [],
	controllers: [InvoiceController],
	exports: [],
})
export class InvoiceModule {}
