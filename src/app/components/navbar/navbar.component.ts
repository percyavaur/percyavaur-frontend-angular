import {
  Component,
  OnInit,
  ElementRef,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { UserInfoService } from "src/app/services/user-info.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  clickEventsubscription: Subscription;
  public focus;
  public listTitles: any[];
  public location: Location;
  session: boolean;
  imageurl: string;
  firstname: string;
  lastname: string;

  @Output() signOut: EventEmitter<boolean>;
  @Input() ROUTES2;

  constructor(location: Location, private userInfoService: UserInfoService) {
    this.location = location;
    this.signOut = new EventEmitter();
    this.getUserData();
    
    this.userInfoService.getClickEvent().subscribe(() => {
      this.getUserData();
    });
  }

  ngOnInit() {
    this.listTitles = this.ROUTES2.filter((listTitle) => listTitle);
  }

  getUserData() {
    var userData: any = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);
      this.imageurl = userData.imageurl
        ? userData.imageurl
        : "https://www.puntodioro.com/img/testimonials/person-icon.png";
      this.firstname = userData.firstname.split(" ", 1);
      this.lastname = userData.lastname.split(" ", 1);
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  async onSignOut() {
    this.signOut.emit(this.session);
  }
}
