import { AppInfo } from './app-info';

export interface ApiCallResult {
  targetUrl: string;
  appInfoModel: AppInfo;
  errorMessage: string;
}
