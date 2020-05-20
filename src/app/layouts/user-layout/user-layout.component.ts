import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

@Component({
  selector: "app-admin-layout",
  templateUrl: "./user-layout.component.html",
})
export class UserLayoutComponent implements OnInit {
  loading: boolean = true;

  ROUTES2: RouteInfo[] = [
    {
      path: "/user-profile",
      title: "Perfil de usuario",
      icon: "ni-single-02 text-yellow",
      class: "",
    },
  ];

  constructor(
    private auth: AuthService,
    private user: UserService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.spinner.show();
    const userData = await this.user.getUser();
    if (userData.success) {
      await localStorage.setItem("userData", JSON.stringify(userData.userData));
    } else {
      await this.auth.signOut();
      this.router.navigate(["/signIn"]);
    }
    this.getRole();
    this.loading = false;
    this.spinner.hide();
  }

  getRole() {
    var userData: any = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);
      if (userData.id_role == 1 || userData.id_role == 2) {
        this.ROUTES2.push({
          path: "/user-list",
          title: "Lista de usuarios",
          icon: "ni-bullet-list-67 text-red",
          class: "",
        });
      }
    }
  }

  async onSignOut() {
    Swal.fire({
      title: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        this.spinner.show();
        await this.auth.signOut();
        this.router.navigate(["/signIn"]);
        this.spinner.hide();
      }
    });
  }
}
