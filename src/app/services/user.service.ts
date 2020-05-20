import { Injectable } from "@angular/core";
import axios from "axios";

import { AuthService } from "./auth.service";
import { GlobalConstants } from "../constans/globalConstants";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private url = `${GlobalConstants.apiURL}/api/user`;
  constructor(private auth: AuthService) {}

  async getUser() {
    var result;
    var accessToken = await this.auth.readAccessToken();

    if (!accessToken) {
      await this.auth.getNewAccessToken();
      accessToken = await this.auth.readAccessToken();
    }

    await axios
      .get(`${this.url}/getUser`, {
        headers: { Authorization: `bearer ${accessToken}` },
        withCredentials: true,
      })
      .then((res) => {
        result = res.data;
      })
      .catch((err) => {
        result = err.response.data;
      });

    return result;
  }

  async updateUser(newUserData) {
    var result;
    var accessToken = await this.auth.readAccessToken();

    if (!accessToken) {
      await this.auth.getNewAccessToken();
      accessToken = await this.auth.readAccessToken();
    }

    await axios
      .put(`${this.url}/updateUser`, newUserData, {
        headers: { Authorization: `bearer ${accessToken}` },
        withCredentials: true,
      })
      .then((res) => {
        result = res.data;
      })
      .catch((err) => {
        result = err.response.data;
      });

    return result;
  }

  async getUsersInfo(offset: number, limit: number) {
    var result;
    var accessToken = await this.auth.readAccessToken();

    if (!accessToken) {
      await this.auth.getNewAccessToken();
      accessToken = await this.auth.readAccessToken();
    }
    await axios
      .post(
        `${this.url}/getUsersInfo`,
        { offset, limit },
        {
          headers: { Authorization: `bearer ${accessToken}` },
          withCredentials: true,
        }
      )
      .then((res) => {
        result = res.data;
      })
      .catch((err) => {
        result = err.response.data;
      });

    return result;
  }
}
