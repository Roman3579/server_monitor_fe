import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_CONFIG_TOKEN, ApiConfig } from '../config/api-config';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  constructor(
    private httpClient: HttpClient,
    @Inject(API_CONFIG_TOKEN) private apiConfig: ApiConfig
  ) {}

  public getAppTargets() {
    return this.httpClient.get<string[]>(
      this.apiConfig.baseUrl +
        this.apiConfig.settingsEndpoint +
        this.apiConfig.targetsEndpoint
    );
  }
}
