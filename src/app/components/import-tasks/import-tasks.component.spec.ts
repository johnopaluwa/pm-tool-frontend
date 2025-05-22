import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTasksComponent } from './import-tasks.component';

describe('ImportTasksComponent', () => {
  let component: ImportTasksComponent;
  let fixture: ComponentFixture<ImportTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
