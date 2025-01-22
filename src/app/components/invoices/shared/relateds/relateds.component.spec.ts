import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedsComponent } from './relateds.component';

describe('RelatedsComponent', () => {
  let component: RelatedsComponent;
  let fixture: ComponentFixture<RelatedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
