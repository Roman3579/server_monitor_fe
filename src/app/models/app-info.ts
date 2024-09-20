import {ApiCallError} from "./api-call-error";

export interface AppInfo {
  appType: string;
  description: string;
  frontendUrl: string;
  apiCallError: ApiCallError;
}

export interface AppInfoRequest {
  appType: string;
  description: string;
  frontendUrl: string;
}
