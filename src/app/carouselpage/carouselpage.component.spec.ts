import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselpageComponent } from './carouselpage.component';

describe('CarouselpageComponent', () => {
  let component: CarouselpageComponent;
  let fixture: ComponentFixture<CarouselpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
