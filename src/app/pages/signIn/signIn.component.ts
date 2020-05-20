import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

import { AuthService } from "src/app/services/auth.service";
import { UserModel } from "../../models/user.model";
import { GlobalConstants } from "src/app/constans/globalConstants";

@Component({
  selector: "app-signIn",
  templateUrl: "./signIn.component.html",
})
export class SignInComponent implements OnInit, OnDestroy {
  user: UserModel = new UserModel();
  jwt: string;
  rememberUser: boolean = false;
  private url = `${GlobalConstants.apiURL}/api/auth`;

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.spinner.show();
    if (localStorage.getItem("identifier")) {
      this.user.identifier = localStorage.getItem("identifier");
      this.rememberUser = true;
    }

    this.activatedRoute.params.subscribe((params) => {
      this.jwt = params["jwt"];
    });
  }

  async ngOnInit() {
    if (this.jwt) {
      this.spinner.show();
      const googleOAuth = await this.auth.oauthSignin(this.jwt);

      if (!googleOAuth.success) {
        this.router.navigate(["/signIn"]);
      } else {
        this.spinner.hide();
        await this.auth.saveAccessToken(googleOAuth.accessToken);
        this.router.navigate(["/user-profile"]);
        this.toast();
      }
    }
    this.spinner.hide();
  }

  ngOnDestroy() {}

  async onSubmit(form: NgForm) {
    this.spinner.show();
    if (form.invalid) {
      console.log("invalid");
    } else {
      const signedIn = await this.auth.signIn(this.user);

      if (!signedIn.success) {
        this.alert("error", "Algo salio mal...", signedIn.message);
      } else {
        if (this.rememberUser) {
          localStorage.setItem("identifier", this.user.identifier);
        } else {
          localStorage.removeItem("identifier");
        }

        await this.auth.saveAccessToken(signedIn.accessToken);
        this.router.navigate(["/user-profile"]);
        this.toast();
      }
    }
    this.spinner.hide();
  }

  goToGoogleAuth() {
    window.location.href = `${this.url}/google`;
  }

  goToFacebookAuth() {
    window.location.href = `${this.url}/facebook`;
  }

  validateInput(form: NgForm, value: string) {
    return form.submitted && form.controls[value].errors;
  }

  alert(icon: any, title: any, text: any, footer?: any) {
    Swal.fire({
      icon,
      title,
      text,
      footer: !footer ? null : "<a href>Why do I have this issue?</a>",
    });
  }

  toast() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Inicio de sesión correcto",
    });

    return Toast;
  }
}
