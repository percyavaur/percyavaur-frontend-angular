import { Routes } from "@angular/router";

import { SignInComponent } from "../../pages/signIn/signIn.component";
import { SignUpComponent } from "../../pages/signUp/signUp.component";

export const AuthLayoutRoutes: Routes = [
  { path: "signIn", component: SignInComponent },
  { path: "signIn/:jwt", component: SignInComponent },
  { path: "signUp", component: SignUpComponent },
];
