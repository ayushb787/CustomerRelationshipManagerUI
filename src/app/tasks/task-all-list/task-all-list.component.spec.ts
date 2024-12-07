import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAllListComponent } from './task-all-list.component';

describe('TaskAllListComponent', () => {
  let component: TaskAllListComponent;
  let fixture: ComponentFixture<TaskAllListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAllListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
