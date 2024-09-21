import { ApiError } from './api-error';
import { AppInfo } from './app-info';

export interface ApiCallResult {
  targetUrl: string;
  appInfoModel: AppInfo;
  errorMessage: ApiError;
}
