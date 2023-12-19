import { environment } from 'environments/environment';

export class Globals {
  readonly backendUri: string =
    environment.schema + '://' + environment.host + environment.apiPath;
  readonly authUri: string = environment.authURL;

  readonly Roles = [
    'ANONYMOUS',
    'CUSTOMER',
    'INTERPRETER',
    'CAPTIONER',
    'COMPANY_EMPLOYEE',
    'COMPANY_LEADER',
    'SWITCHING_CENTER_EMPLOYEE',
    'SWITCHING_CENTER_LEADER',
    'COMMUNICATION_ASSISTANCE',
    'ADMIN',
  ];
  // readonly backendUri: string = 'http://'+environment.host+':'+environment.port+environment.apiPath;
}
export interface ApiResponse {
  apiError: null | {
    errorCode: 400;
    errorMessage: string;
  };
  apiSuccess: null | number;
  data: null | any;
  valid: boolean;
}
