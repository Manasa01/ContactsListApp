import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsDisplayComponent } from './contacts-display.component';

describe('ContactsDisplayComponent', () => {
  let component: ContactsDisplayComponent;
  let fixture: ComponentFixture<ContactsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
