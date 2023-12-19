export class ChangePasswordRequest {
  constructor(
    public id: number,
    public username: String,
    public password: string
  ) {}
}
