export class AuthResponse {
  constructor(
    public apiError: any,
    public apiSuccess: number,
    public data : {
       token: string,
       refreshToken: string,
       user: any
    },
    public valid: boolean
  ) {}
}

