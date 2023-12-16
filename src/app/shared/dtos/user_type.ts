/* eslint-disable @typescript-eslint/naming-convention */
export enum UserType {
  ADMIN,
  CUSTOMER,
  CAPTIONER,
  INTERPRETER,
  COMMUNICATIONASSISTENCE,
  COMPANYLEADER,
  COMPANYEMPLOYEE,
  COMPANY,
  SWITCHINGCALLCENTERLEADER,
  SWITCHINGCALLCENTEREMPLOYEE,
  SWITCHINGCALLCENTER,
  ANONYMOUS,
}

export class UserTypeClass {
  constructor(
    public name: string,
    public label: string,
    ) {}
}
