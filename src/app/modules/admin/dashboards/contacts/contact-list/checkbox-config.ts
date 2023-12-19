import { InjectionToken } from "@angular/core";
export const CHECKBOX_CONFIG = new InjectionToken<CheckboxConfig>(
  "checkbox.config"
);

export interface CheckboxConfig {
  isInterpreterChecked: boolean;
  isCaptionerChecked: boolean;
  isSwitchingcenterChecked: boolean;
  isCompanyChecked: boolean;
}
