import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const currentUser = request.currentUser;

      console.log('AuthorizeGuard - allowedRoles:', allowedRoles);
      console.log('AuthorizeGuard - currentUser:', currentUser);
      console.log('AuthorizeGuard - user role:', currentUser?.role);

      if (currentUser && allowedRoles.includes(currentUser.role)) {
        return true;
      }

      throw new UnauthorizedException('Sorry, you are not authorized.');
    }
  }
//mixin is a way to share code between classes in nest..
//it is a class that can be used by another class.
//mixins are used to add functionality to a class without modifying the original class.
//
  const guard = mixin(RolesGuardMixin);
  return guard;
};
