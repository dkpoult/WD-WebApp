import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  validate(destination: string) {
    return this.authService.validateCurrentUser()
      .pipe(
        map((result: any) => {
          if (result.responseCode === 'successful') {
            return true;
          } else {
            const tree = this.router.createUrlTree(['login']);
            tree.queryParams = {redirect: destination};
            return tree;
          }
        }
        )
      );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    new UrlTree();
    return this.validate(encodeURIComponent(state.url));
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validate(encodeURIComponent(state.url));
  }

}
