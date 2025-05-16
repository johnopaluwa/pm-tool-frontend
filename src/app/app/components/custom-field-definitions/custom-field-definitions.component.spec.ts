import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldDefinitionsComponent } from './custom-field-definitions.component';

describe('CustomFieldDefinitionsComponent', () => {
  let component: CustomFieldDefinitionsComponent;
  let fixture: ComponentFixture<CustomFieldDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldDefinitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomFieldDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
