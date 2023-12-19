import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TeamMemberService {
  // private teamMembers: any[] = [];
  private teamMembersSubject = new BehaviorSubject<any[]>([]);
  teamMembers$ = this.teamMembersSubject.asObservable();
  private readonly STORAGE_KEY = "userProfileData";

  constructor() {}
  intialize() {
    const storedMembers = localStorage.getItem("members");
    const members = storedMembers ? JSON.parse(storedMembers) : [];
    this.teamMembersSubject.next(members);
    return this.teamMembers$;
  }
  addTeamMember(member: any): void {
    const teamMembers = this.teamMembersSubject.getValue();
    teamMembers.push(member);
    this.teamMembersSubject.next(teamMembers);
  }
  getTeamMembersSubject() {
    return this.teamMembersSubject.asObservable();
  }

  getData(): any {
    const userProfileDataJson = localStorage.getItem(this.STORAGE_KEY);
    return userProfileDataJson ? JSON.parse(userProfileDataJson) : null;
  }

  setUserProfileData(userProfileData: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userProfileData));
  }
}
