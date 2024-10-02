import { InjectionToken } from '@angular/core';

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfig>('');

export interface ApiConfig {
  baseUrl: string;
  infoEndpoint: string;
  logsEndpoint: string;
  settingsEndpoint: string;
  targetsEndpoint: string;
}

export const apiConfig: ApiConfig = {
  baseUrl: 'http://localhost:8080',
  infoEndpoint: '/api/v1/results',
  logsEndpoint: '/logs',
  settingsEndpoint: '/api/v1/settings',
  targetsEndpoint: '/target',
};
