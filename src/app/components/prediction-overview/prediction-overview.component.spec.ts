import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionOverviewComponent } from './prediction-overview.component';

describe('PredictionOverviewComponent', () => {
  let component: PredictionOverviewComponent;
  let fixture: ComponentFixture<PredictionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictionOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
