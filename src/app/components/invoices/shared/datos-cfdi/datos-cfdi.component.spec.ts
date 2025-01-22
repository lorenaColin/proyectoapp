import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCfdiComponent } from './datos-cfdi.component';

describe('DatosCfdiComponent', () => {
  let component: DatosCfdiComponent;
  let fixture: ComponentFixture<DatosCfdiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosCfdiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosCfdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
