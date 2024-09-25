import {Component, computed, input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {AppInfoService} from "../../services/app-info.service";


@Component({
  selector: 'app-app-detail',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './app-detail.component.html',
  styleUrl: './app-detail.component.scss'
})
export class AppDetailComponent {
  target = input.required<string>();
  originIp = computed(() => {
    try {
      return this.appInfoService.extractIp(this.target());
    } catch (error) {
      console.warn(`Failed to extract Ip from ${this.target()}`);
      return 'unknown';
    }
  });

  originPort = computed(() => {
    try {
      return this.appInfoService.extractPort(this.target());
    } catch (error) {
      console.warn(`Failed to extract port from ${this.target()}`);
      return 'unknown';
    }
  });

  originAppInfo = computed(() => {
    try {
      return this.appInfoService.getAppInfo();
    } catch (error) {
      console.warn(`Failed to extract info from ${this.target()}`);
      return 'unknown';
    }
  });
  constructor(
    private appInfoService: AppInfoService
  ) {}
}

