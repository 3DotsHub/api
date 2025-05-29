import { Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/roles.types';

@ApiTags('Invoice Controller')
@Controller('invoice')
@Roles(Role.Partner)
export class InvoiceController {
	constructor() {}

	@ApiResponse({
		description: '',
	})
	@Post('list')
	getList() {
		return 'list';
	}

	@ApiResponse({
		description: '',
	})
	@Post('create')
	async getCreate() {
		return 'create';
	}

	@ApiResponse({
		description: '',
	})
	@Post('update')
	async getUpdate() {
		return 'update';
	}

	@ApiResponse({
		description: '',
	})
	@Post('upload')
	async getUpload() {
		return 'upload file';
	}
}
