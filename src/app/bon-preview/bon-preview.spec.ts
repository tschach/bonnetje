import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonPreview } from './bon-preview';

describe('BonPreview', () => {
  let component: BonPreview;
  let fixture: ComponentFixture<BonPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
