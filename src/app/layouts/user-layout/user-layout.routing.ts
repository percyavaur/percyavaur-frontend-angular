import { Routes } from "@angular/router";

import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { UserListComponent } from "../../pages/user-list/user-list.component";
import { AdminGuard } from "../../guards/admin.guard";

export const UserLayoutRoutes: Routes = [
  { path: "user-profile", component: UserProfileComponent },
  { path: "user-list", component: UserListComponent, canActivate: [AdminGuard] },
];
