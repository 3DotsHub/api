import { Controller, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller()
export class StorjUploadController {
	constructor() {}

	@UseInterceptors(FileInterceptor('file'))
	@Post('file')
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		return {
			file: file.buffer.toString(),
		};
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('file/pass-validation')
	uploadFileAndPassValidation(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: 'jpeg',
				})
				.build({
					fileIsRequired: true,
				})
		)
		file?: Express.Multer.File
	) {
		return {
			file: file?.buffer.toString(),
		};
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('file/fail-validation')
	uploadFileAndFailValidation(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: 'jpg',
				})
				.build()
		)
		file: Express.Multer.File
	) {
		return {
			file: file.buffer.toString(),
		};
	}
}
