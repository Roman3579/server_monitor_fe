import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly EXPANDED_VIEWS_KEY = 'expanded-views';

  constructor() {
    this.initializeSavedExpandedViews();
  }

  private initializeSavedExpandedViews() {
    this.saveExpandedViews([]);
  }

  retrieveExpandedIpViews(): string[] {
    const expandedViewsString = localStorage.getItem(this.EXPANDED_VIEWS_KEY);
    if (!expandedViewsString) {
      return [];
    }
    return JSON.parse(expandedViewsString);
  }

  addToExpandedViews(expandedView: string) {
    const expandedViews = this.retrieveExpandedIpViews();
    expandedViews.push(expandedView);
    this.saveExpandedViews(expandedViews);
  }

  saveExpandedViews(expandedViews: string[]) {
    localStorage.setItem(
      this.EXPANDED_VIEWS_KEY,
      JSON.stringify(expandedViews)
    );
  }
}
