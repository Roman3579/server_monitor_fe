import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpOverviewComponent } from './ip-overview.component';

describe('IpOverviewComponent', () => {
  let component: IpOverviewComponent;
  let fixture: ComponentFixture<IpOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
