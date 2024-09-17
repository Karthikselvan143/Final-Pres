import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoomsComponent } from './user-rooms.component';

describe('UserRoomsComponent', () => {
  let component: UserRoomsComponent;
  let fixture: ComponentFixture<UserRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRoomsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
