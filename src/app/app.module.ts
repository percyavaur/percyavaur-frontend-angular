import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from "./app.component";
import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { CookieService } from "ngx-cookie-service";
import { PrivacyPolicyComponent } from "./components/privacy-policy/privacy-policy.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
  ],
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AuthLayoutComponent,
    PrivacyPolicyComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
