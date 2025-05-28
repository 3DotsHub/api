import { Controller, ParseFilePipeBuilder, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { StorjClient } from './storj.client.service';
import { AuthenticatedRequest } from '../auth/auth.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File Controller')
@Controller('file')
export class StorjUploadController {
	constructor(private readonly storj: StorjClient) {}

	@UseInterceptors(FileInterceptor('file'))
	@Post('validation')
	async uploadFileAndPassValidation(
		@UploadedFile(
			new ParseFilePipeBuilder().build({
				fileIsRequired: true,
			})
		)
		file: Express.Multer.File | undefined,

		@Req()
		req: AuthenticatedRequest
	) {
		const user = req.user;
		if (!user) throw new UnauthorizedException();

		const { buffer, originalname } = file;
		const result = await this.storj.write(`/test/${user.address.toLowerCase()}/${originalname}`, buffer, true);

		return {
			result,
		};
	}
}
