import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { PartnerDTO } from './dtos/partner.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/roles.enum';

@ApiTags('Partner Controller')
@Controller('partner')
@Roles(Role.Manager) // @dev: give manager permission
export class PartnerController {
	constructor(private readonly partner: PartnerService) {}

	@ApiResponse({
		description: '',
	})
	@Post('list')
	getList() {
		return this.partner.list();
	}

	@ApiResponse({
		description: '',
	})
	@Post('create')
	async getPartnerCreate(
		@Body() { firstName, lastName, companyName, email, street, number, additional, zipcode, city, country }: PartnerDTO
	) {
		console.log({ firstName, lastName, companyName, email, street, number, additional, zipcode, city, country });
		if (!firstName && !lastName && !companyName) console.log('asdf');

		const id = this.partner.list().length;
		const time = Date.now();
		return await this.partner.create({
			id,
			createdAt: time,
			updatedAt: time,
			verified: false,
			pending: true,
			locked: true,

			partner: {
				firstName: firstName,
				lastName: lastName,
				companyName: companyName,
				email: email,
				address: {
					street: street,
					number: number,
					additional: additional,
					zipcode: zipcode,
					city: city,
					country: country,
				},
			},

			permission: {
				read: [],
				write: [],
			},
		});
	}

	@ApiResponse({
		description: '',
	})
	@Post('update')
	async getPartnerUpdate() {
		return 'partner update';
	}
}
