import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly COLLAPSED_VIEWS_KEY = 'collapsed-views';

  constructor() {}

  retrieveCollapsedIpViews(): string[] {
    const collapsedViewsString = localStorage.getItem(this.COLLAPSED_VIEWS_KEY);
    if (!collapsedViewsString) {
      return [];
    }
    return JSON.parse(collapsedViewsString);
  }

  addToCollapsedViews(collapsedView: string) {
    const collapsedViews = this.retrieveCollapsedIpViews();
    collapsedViews.push(collapsedView);
    this.savedCollapsedViews(collapsedViews);
  }

  removeFromCollapsedViews(collapsedView: string) {
    const collapsedViews = this.retrieveCollapsedIpViews();
    const filtered = collapsedViews.filter(
      (element) => element != collapsedView
    );
    this.savedCollapsedViews(filtered);
  }

  savedCollapsedViews(collapsedViews: string[]) {
    localStorage.setItem(
      this.COLLAPSED_VIEWS_KEY,
      JSON.stringify(collapsedViews)
    );
  }
}
