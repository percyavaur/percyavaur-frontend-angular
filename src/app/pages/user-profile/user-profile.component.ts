import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { map, finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import * as uuid from "uuid";
import * as _ from "lodash";

import { UserModel } from "../../models/user.model";
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from "src/app/services/user.service";
import { UserInfoService } from "src/app/services/user-info.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: UserModel = new UserModel();
  updateUser: UserModel = new UserModel();
  disableForm = true;
  title = "cloudsSorage";
  selectedFile: File = null;
  downloadURL: Observable<string>;
  updateDisabled: true;
  fb;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private storage: AngularFireStorage,
    private userService: UserService,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit() {
    this.getUserData();
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  getUserData() {
    var userData: any = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);
      this.user.id = userData.id;
      this.user.firstname = userData.firstname;
      this.user.lastname = userData.lastname;
      this.user.username = userData.username;
      this.user.email = userData.email;
      this.user.imageurl = userData.imageurl
        ? userData.imageurl
        : "https://www.puntodioro.com/img/testimonials/person-icon.png";
      this.user.id_rol = userData.id_rol;
    }
  }

  async onSubmitUpdate(form: NgForm, submitButton) {
    this.spinner.show();
    if (form.valid) {
      const queryResponse = await this.userService.updateUser(this.updateUser);
      if (!queryResponse.success) {
        this.alert("error", "Algo salio mal...", queryResponse.message);
      } else {
        submitButton.disabled = true;
        this.alert("success", "Completado!", "Tu cuenta ha sido actualizada");
        localStorage.removeItem("userData");
        localStorage.setItem("userData", JSON.stringify(queryResponse.user));
        this.getUserData();
        this.userInfoService.sendClickEvent();
      }
    }
    this.spinner.hide();
  }

  onKeyUp(submitButton) {
    var userData: any = localStorage.getItem("userData");
    userData = JSON.parse(userData);

    if (
      this.updateUser.firstname === userData.firstname &&
      this.updateUser.lastname === userData.lastname &&
      this.updateUser.username === userData.username
    ) {
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
    }
  }

  validateInput(form: NgForm, value: string) {
    return form.submitted && form.controls[value].errors;
  }

  onFileSelected(event, submitButton) {
    const id_image = uuid.v4();
    const file = event.target.files[0];

    if (file) {
      submitButton.disabled = true;
      if (file.size <= 10 * 1048576) {
        this.updateUser.imageurl = "./assets/img/brand/spinner.gif";
        const filePath = `users/${this.updateUser.id}/profileImage/${id_image}`;
        const fileRef = this.storage.ref(filePath);
        console.log(file);
        const task = this.storage.upload(
          `users/${this.updateUser.id}/profileImage/${id_image}`,
          file
        );
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(
                (url) => {
                  if (url) {
                    this.fb = url;
                    submitButton.disabled = false;
                  }
                  this.updateUser.imageurl = this.fb;
                },
                (err) => {
                  var userData: any = localStorage.getItem("userData");
                  userData = JSON.parse(userData);
                  this.updateUser.imageurl = userData.imageurl;
                }
              );
            })
          )
          .subscribe((url) => {
            if (url) {
              console.log(url);
            }
          });
      } else {
        this.alert(
          "error",
          "Imagen invalida",
          "La imagen debe ser menor a 10 mb"
        );
      }
    }
  }

  openVerticallyCentered(content) {
    var userData: any = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    this.updateUser.id = userData.id;
    this.updateUser.firstname = userData.firstname;
    this.updateUser.lastname = userData.lastname;
    this.updateUser.username = userData.username;
    this.updateUser.email = userData.email;
    this.updateUser.imageurl = userData.imageurl
      ? userData.imageurl
      : "https://www.puntodioro.com/img/testimonials/person-icon.png";
    this.updateUser.id_rol = userData.id_rol;

    this.modalService.open(content, {
      size: "lg",
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
