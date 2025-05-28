import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class PartnerDTO {
	constructor() {
		this.firstName = '';
		this.lastName = '';
		this.companyName = '';

		this.street = '';
		this.number = '';
		this.additional = '';
		this.zipcode = '';
		this.city = '';
		this.country = '';
	}

	// PartnerPerson
	@ApiProperty({ example: 'Tony', description: 'Enter your first name' })
	@IsOptional()
	@IsString()
	firstName: string;

	@IsOptional()
	@ApiProperty({ example: 'Stark', description: 'Enter your last name' })
	@IsString()
	lastName: string;

	// PartnerCompany
	@ApiProperty({ example: 'Stark Industries', description: 'Enter the company name' })
	@IsOptional()
	@IsString()
	companyName: string;

	@IsString()
	@ApiProperty({ example: 'tony@stark.com', description: 'Enter the email address' })
	email: string;

	// PartnerAddress
	@ApiProperty({ example: 'Airfield', description: 'Enter the street name' })
	@IsString()
	street: string;

	@ApiProperty({ example: '1a', description: 'Enter the street number' })
	@IsString()
	number: string;

	@ApiProperty({ example: 'c/o ...', description: 'Enter additional details' })
	@IsString()
	additional: string;

	@ApiProperty({ example: '1000', description: 'Enter the zipcode' })
	@IsString()
	zipcode: string;

	@ApiProperty({ example: 'Airbase', description: 'Enter the city' })
	@IsString()
	city: string;

	@ApiProperty({ example: 'Spaceland', description: 'Enter the country' })
	@IsString()
	country: string;
}
