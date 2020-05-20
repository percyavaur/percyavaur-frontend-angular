import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ClipboardModule } from "ngx-clipboard";
import { AngularFireModule } from "@angular/fire";
import {
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { environment } from "../../../environments/environment";

import { UserLayoutRoutes } from "./user-layout.routing";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { UserListComponent } from "../../pages/user-list/user-list.component";
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgxSpinnerModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase, "cloud"),
  ],
  declarations: [UserProfileComponent, UserListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserLayoutModule {}
