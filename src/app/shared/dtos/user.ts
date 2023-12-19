import { OnlineStatus } from "app/core/user/user.types";
import { UserType } from "./user_type";

export class User {
  constructor(
    public userId: number,
    // public role: string,
    // public name: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public userType: UserType,
    public street: string,
    public location: string,
    public city: string,
    public state: string,
    public country: string,
    public zip: string,
    public houseNo: string,
    public phoneNo: string,
    public userSince: string,
    public lastLogin: string,
    public onlineStatus: OnlineStatus,
    public birthday?: string | null,
    public profilePhoto?: string | null,
    public pdfs?: string[] | null,
    public counter?: number | null,
    public password?: string | null,
    public captcha?: string | null
  ) {}
}
