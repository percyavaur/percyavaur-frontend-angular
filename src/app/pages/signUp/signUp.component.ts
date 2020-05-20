import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

import { AuthService } from "src/app/services/auth.service";
import { UserModel } from "../../models/user.model";
import { GlobalConstants } from "src/app/constans/globalConstants";

@Component({
  selector: "app-register",
  templateUrl: "./signUp.component.html",
})
export class SignUpComponent implements OnInit {
  user: UserModel = new UserModel();
  private url = `${GlobalConstants.apiURL}/api/auth`;

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.hide();
  }

  async onSubmit(form: NgForm) {
    this.spinner.show();
    if (form.invalid) {
      console.log("invalid");
    } else {
      const queryResponse = await this.auth.signUp(this.user);

      if (!queryResponse.success) {
        this.alert("error", "Algo salio mal...", queryResponse.message);
      } else {
        this.alert("success", "Completado!", queryResponse.message);
        this.router.navigate(["/signIn"]);
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
}
