import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCallResult } from '../models/api-call-result';
import { map } from 'rxjs';
import { AppInfo } from '../models/app-info';

@Injectable({
  providedIn: 'root',
})
export class AppInfoService {
  api = '/api/v1/results/mock';

  constructor(private httpClient: HttpClient) {}

  public getAppInfo() {
    return this.httpClient.get<{ apiCallResults: ApiCallResult[] }>(this.api);
  }

  public updateAppInfo(appInfo: AppInfo) {
    return this.httpClient.put(this.api, appInfo);
  }

  public getGroupedAppInfo() {
    return this.getAppInfo().pipe(map((data) => this.groupResultsByIp(data)));
  }

  private groupResultsByIp(data: { apiCallResults: ApiCallResult[] }) {
    const grouped: { [key: string]: ApiCallResult[] } = {};
    const ips = this.extractDistinctIps(data);
    ips.forEach((ip) => {
      const ipGroup = Array<ApiCallResult>();
      data.apiCallResults.forEach((callResult) => {
        if (callResult.targetUrl.startsWith(ip)) {
          ipGroup.push(callResult);
        }
      });
      grouped[ip] = ipGroup;
    });
    return grouped;
  }

  public extractDistinctIps(results: { apiCallResults: ApiCallResult[] }) {
    const ips = new Set<string>();
    results.apiCallResults.forEach((result) => {
      ips.add(this.extractIp(result.targetUrl));
    });
    return ips;
  }

  public extractPorts(results: { apiCallResults: ApiCallResult[] }) {
    const ports = new Set<string>();
    results.apiCallResults.forEach((result) =>
      ports.add(this.extractPort(result.targetUrl))
    );
    return ports;
  }

  extractIp(url: string) {
    const urlObject = new URL(url);
    return `${urlObject.protocol}//${urlObject.hostname}`;
  }

  extractPort(url: string) {
    return new URL(url).port;
  }
}
