import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = req.currentUser;
        if (!user) {
            return false;
        }

        return user.admin;
    }
}