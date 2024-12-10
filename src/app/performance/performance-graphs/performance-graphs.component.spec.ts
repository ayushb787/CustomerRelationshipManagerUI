import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceGraphsComponent } from './performance-graphs.component';

describe('PerformanceGraphsComponent', () => {
  let component: PerformanceGraphsComponent;
  let fixture: ComponentFixture<PerformanceGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
