import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import axios from "axios";
import Swal from "sweetalert2";

import { UserModel } from "../models/user.model";
import { GlobalConstants } from "../constans/globalConstants";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = `${GlobalConstants.apiURL}/api/auth`;
  accessToken: string;

  constructor(private cookie: CookieService) {}

  async signUp(user: UserModel) {
    var response: any;

    await axios
      .post(`${this.url}/signUp`, user, { withCredentials: true })
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        response = err.response.data;
      });
    return response;
  }

  async signIn(user: UserModel) {
    const ip = await this.getIp();
    let response: any;

    await axios
      .post(`${this.url}/signIn`, { ...user, ip }, { withCredentials: true })
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        response = err.response.data;
      });

    return response;
  }

  async signOut() {
    let response: any;

    await axios
      .delete(`${this.url}/signOut`, { withCredentials: true })
      .then((res) => {
        response = res.data;
        this.cookie.delete("accessToken");
        localStorage.removeItem("userData");
      })
      .catch((err) => {
        response = err.response.data;
      });

    return response;
  }

  async oauthSignin(jwt: string) {
    const ip = await this.getIp();
    let response: any;

    await axios
      .post(
        `${this.url}/OAuth/signIn`,
        { ip },
        {
          headers: { Authorization: `bearer ${jwt}` },
          withCredentials: true,
        }
      )
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        response = err.response.data;
      });

    return response;
  }

  saveAccessToken(token: string) {
    var currentDate = new Date();
    var expires = new Date(currentDate.getTime() + 7.5 * 60 * 1000);
    this.cookie.set("accessToken", token, expires);
  }

  readAccessToken() {
    var response;
    this.accessToken = this.cookie.get("accessToken");
    if (this.accessToken) {
      response = this.accessToken;
    } else {
      response = false;
    }
    return response;
  }

  async getNewAccessToken() {
    var result;
    await axios
      .get(`${this.url}/newAccessToken`, { withCredentials: true })
      .then((res) => {
        const { accessToken } = res.data;
        this.saveAccessToken(accessToken);
        result = accessToken;
      })
      .catch((err) => {
        result = err.response.data.success;
      });
    return result;
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      try {
        await axios
          .get(`${this.url}/validateSession`, { withCredentials: true })
          .then((res) => {
            resolve(res.data.success);
          })
          .catch((err) => {
            if (err.response.data.important) {
              this.alert(
                "error",
                "Algo salio mal...",
                err.response.data.message
              );
            }
            if (err.response.data.destroy) {
              this.cookie.delete("accessToken");
            }
            resolve(err.response.data.success);
          });
      } catch (error) {
        this.alert(
          "error",
          "Lo sentimos",
          "Por el momento, no hay conexión al servidor"
        );
        resolve(false);
      }
    });
  }

  isAdmin(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      try {
        await axios
          .get(`${this.url}/validateAdmin`, { withCredentials: true })
          .then((res) => {
            resolve(res.data.success);
          })
          .catch((err) => {
            if (err.response.data.important) {
              this.alert(
                "error",
                "Algo salio mal...",
                err.response.data.message
              );
            }
            if (err.response.data.destroy) {
              this.cookie.delete("accessToken");
            }
            resolve(err.response.data.success);
          });
      } catch (error) {
        this.alert(
          "error",
          "Lo sentimos",
          "Por el momento, no hay conexión al servidor"
        );
        resolve(false);
      }
    });
  }

  async getIp() {
    var ip: string;

    await axios
      .get("https://api.ipify.org?format=json")
      .then((response) => (ip = response.data.ip));
    return ip;
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
