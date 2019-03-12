import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemModalPage } from './list-item-modal.page';

describe('ListItemModalPage', () => {
  let component: ListItemModalPage;
  let fixture: ComponentFixture<ListItemModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
