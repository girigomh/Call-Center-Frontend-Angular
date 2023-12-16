export class RegisterUserSchema {
  constructor (
   public firstName: string,
   public lastName: string,
   public gender: Gender,
   public email: string,
   public dob: string,
   public username: string,
   public password: string,
   public phone: number,
   public addressDto: {
      houseNo: string,
      street: string,
      location: string,
      city: string,
      state: string,
      country: string,
      zip: string
    },
    public profilePhoto: string,
    public titlePhoto: string,
    public videoCallUrl: string,
    public companyDto?: {
      id: 0,
      name: string
    },
    public role?: string
  ) {}  


}
export enum Gender {
    O,
    M,
    F
}