import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, shareReplay} from 'rxjs';
import {ApiCallResult} from '../models/api-call-result';
import {AppInfoRequest} from '../models/app-info';

@Injectable({
  providedIn: 'root',
})
export class AppInfoService {
  api =
    '/api/v1/results';
  logs_endpoint = "/logs"

  appInfoData: Observable<{ apiCallResults: ApiCallResult[] }>;

  constructor(private httpClient: HttpClient) {
    this.appInfoData = this.getAppInfo().pipe(shareReplay());
  }

  public getAppInfo() {
    return this.httpClient.get<{ apiCallResults: ApiCallResult[] }>(this.api);
  }

  public refreshAppInfo() {
    const subscription = this.getAppInfo().pipe(shareReplay());
    this.appInfoData = subscription;
  }

  public updateAppInfo(url: string, appInfo: AppInfoRequest) {
    return this.httpClient.put(this.api, appInfo, {
      params: new HttpParams().set('targetUrl', url),
    });
  }

  public downloadAppLogs(url: string) {
    return this.httpClient.get(this.api + this.logs_endpoint, {
      params: new HttpParams().set('url', url),
      responseType: 'blob',
    });
  }

  public getGroupedAppInfo() {
    console.log('Getting grouped app data...');
    return this.appInfoData.pipe(map((data) => this.groupResultsByIp(data)));
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

  extractOrigin(url: string) {
    return new URL(url).origin;
  }
}
