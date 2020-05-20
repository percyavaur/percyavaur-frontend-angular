import { Injectable } from "@angular/core";
import {
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.spinner.show();
    if (await this.auth.isAdmin()) {
      this.spinner.hide();
      return true;
    } else {
      this.spinner.hide();
      this.router.navigate(["/signIn"]);
      return false;
    }
  }
}
