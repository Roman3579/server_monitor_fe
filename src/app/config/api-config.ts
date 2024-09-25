import { InjectionToken } from '@angular/core';

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfig>('');

export interface ApiConfig {
  baseUrl: string;
  infoEndpoint: string;
  logsEndpoint: string;
}

export const apiConfig: ApiConfig = {
  baseUrl: 'https://eb64eadd-db7b-4012-bbb4-0768dbe3a5e1.mock.pstmn.io',
  infoEndpoint: '/api/v1/results',
  logsEndpoint: '/logs',
};
