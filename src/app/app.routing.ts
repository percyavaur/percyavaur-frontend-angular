import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { UserGuard } from "./guards/user.guard";
import { AuthGuard } from "./guards/auth.guard";

import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PrivacyPolicyComponent } from "./components/privacy-policy/privacy-policy.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "signIn",
    pathMatch: "full",
  },
  {
    path: "",
    component: UserLayoutComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/user-layout/user-layout.module#UserLayoutModule",
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/auth-layout/auth-layout.module#AuthLayoutModule",
      },
    ],
  },
  { path: "privacyPolicy", component: PrivacyPolicyComponent },
  {
    path: "**",
    redirectTo: "signIn",
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
