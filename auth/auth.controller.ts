import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { SignInDto } from './dtos/SignIn.dto';
import { Public } from './decorators/public.decorator';
import { AuthenticatedRequest } from './auth.types';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
	constructor(private auth: AuthService) {}

	@Public()
	@ApiResponse({
		description: '',
	})
	@Post('message')
	message(@Body() { address, expired, valid }: CreateMessageDto) {
		return this.auth.createMessage({ address, expired, valid });
	}

	@Public()
	@ApiResponse({
		description: '',
	})
	@Post('signIn')
	async signIn(@Body() { message, signature }: SignInDto) {
		return await this.auth.signIn({ message, signature });
	}

	@ApiResponse({
		description: '',
	})
	@Post('scope')
	async scope(
		@Req()
		req: AuthenticatedRequest
	) {
		const user = req.user;
		if (!user) throw new UnauthorizedException();
		return this.auth.getScope(user.address);
	}
}
