import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';
import { Role } from './roles.types';
import { AuthService } from './auth.service';
import { AuthPayload } from './auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly auth: AuthService
	) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
		if (!requiredRoles) return true; // @dev: no role needed, pass

		const { user } = context.switchToHttp().getRequest();
		if (!user) return false; // @dev: user payload not found from token, deny

		const scope = this.auth.getScope((user as AuthPayload).address);
		if (scope.roles.includes(Role.Admin)) return true; // @dev: user is admin, pass

		return requiredRoles.some((role) => scope.roles?.includes(role)); // @dev: verify roles
	}
}
