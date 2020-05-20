import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {
  userList: any = [];
  usersLength: number;

  constructor(
    private auth: UserService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  offset: number = 0;
  limit: number = 4;
  nextArrow: boolean = true;
  previousArrow: boolean = false;
  indexTable: number = 1;
  currentIndex: number = 1;

  async ngOnInit() {
    await this._getUsersInfo();
  }

  async _getUsersInfo() {
    this.spinner.show();
    const usersInfo = await this.auth.getUsersInfo(this.offset, this.limit);
    if (!usersInfo.success) {
      this.spinner.hide();
      return false;
    } else if (usersInfo.users.length === 0) {
      this.alert("warning", "Aviso", "No hay mas usuarios");
      this.spinner.hide();
      return false;
    } else if (usersInfo.success) {
      this.userList = usersInfo.users;
      this.usersLength = this.userList.length;
      console.table(this.userList);
      this.spinner.hide();
      return true;
    }
  }

  async nextValues() {
    this.offset = this.offset + this.limit;
    const values = await this._getUsersInfo();
    if (!values) {
      this.nextArrow = false;
      this.offset = this.offset - this.limit;
    } else {
      if (this.currentIndex === this.indexTable + 2) {
        this.indexTable++;
      }
      this.currentIndex++;
      this.nextArrow = true;
    }
    if (this.currentIndex === 1) {
      this.previousArrow = false;
    } else {
      this.previousArrow = true;
    }
  }

  async previousValues() {
    this.offset = this.offset - this.limit;
    const values = await this._getUsersInfo();
    if (!values) {
      this.nextArrow = true;
      this.offset = this.offset + this.limit;
    } else {
      if (this.currentIndex === this.indexTable) {
        this.indexTable--;
      }
      this.currentIndex--;
      this.nextArrow = true;
    }
    if (this.currentIndex === 1) {
      this.previousArrow = false;
    } else {
      this.previousArrow = true;
    }
  }

  async findUsersByIndexTable(index: number) {
    this.offset = this.offset - this.limit * (this.currentIndex - index);
    const value = await this._getUsersInfo();
    if (value) {
      this.nextArrow = true;
      this.currentIndex = index;
    } else {
      this.offset = this.offset + this.limit * (this.currentIndex - index);
    }

    if (this.currentIndex === 1) {
      this.previousArrow = false;
    } else {
      this.previousArrow = true;
    }
  }

  currentIndexTable(index: any): boolean {
    switch (index) {
      case (index = this.currentIndex):
        return true;
        break;
      case index != this.currentIndex:
        return false;
        break;
    }
  }

  idStatusToName(id_status: number): string {
    switch (id_status) {
      case 1:
        return "Habilitado";
        break;
      case 2:
        return "Deshabilitado";
        break;
      case 3:
        return "Prohibido";
        break;
      case 4:
        return "Eliminado";
        break;
    }
  }

  idStatusToColor(id_status: number): string {
    switch (id_status) {
      case 1:
        return "bg-success";
        break;
      case 2:
        return "bg-warning";
        break;
      case 3:
        return "bg-warning";
        break;
      case 4:
        return "bg-danger";
        break;
    }
  }

  idRoleToName(id_role: number): string {
    switch (id_role) {
      case 1:
        return "Master";
        break;
      case 2:
        return "Administrador";
        break;
      case 3:
        return "Desarrollador";
        break;
      case 4:
        return "Editor de Contenido";
        break;
      case 5:
        return "Cliente";
        break;
    }
  }

  verifiedTocolor(verified: boolean): string {
    switch (verified) {
      case true:
        return "bg-success";
        break;
      case false:
        return "bg-danger";
        break;
    }
  }

  testImg(provider) {
    return `./assets/img/icons/providers/${provider}.png`;
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "fade-in",
    });
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
