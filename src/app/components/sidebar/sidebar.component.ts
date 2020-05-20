import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Router } from "@angular/router";
import { UserInfoService } from "src/app/services/user-info.service";
import { Subscription } from "rxjs";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  clickEventsubscription: Subscription;
  public menuItems: any[];
  public isCollapsed = true;
  session: boolean;
  imageurl: string;
  firstname: string;
  lastname: string;

  @Output() signOut: EventEmitter<boolean>;
  @Input() ROUTES2: [];

  constructor(
    private router: Router,
    private userInfoService: UserInfoService
  ) {
    this.getUserData();
    this.signOut = new EventEmitter();
    this.userInfoService.getClickEvent().subscribe(() => {
      this.getUserData();
    });
  }

  ngOnInit() {
    this.menuItems = this.ROUTES2.filter((menuItem) => {
      return menuItem;
    });
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
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

  async onSignOut() {
    this.signOut.emit(this.session);
  }
}
