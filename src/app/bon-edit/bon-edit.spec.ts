import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonEdit } from './bon-edit';

describe('BonEdit', () => {
  let component: BonEdit;
  let fixture: ComponentFixture<BonEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
