import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthLayoutRoutes } from "./auth-layout.routing";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SignInComponent } from "../../pages/signIn/signIn.component";
import { SignUpComponent } from "../../pages/signUp/signUp.component";
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    NgxSpinnerModule,
    // NgbModule
  ],
  declarations: [SignInComponent, SignUpComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthLayoutModule {}
