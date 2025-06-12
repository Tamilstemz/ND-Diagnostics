import { Component } from '@angular/core';
import { HomePageComponent } from '../home-page/home-page.component';
// import { CarouselpageComponent } from '../carouselpage/carouselpage.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { ServicesOfferedComponent } from '../services-offered/services-offered.component';
import { SecnavComponent } from '../secnav/secnav.component';
import { ReceptionViewComponent } from '../reception-view/reception-view.component';
import { MapviewComponent } from '../mapview/mapview.component';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [HomePageComponent,AboutUsComponent,ServicesOfferedComponent,SecnavComponent,ReceptionViewComponent,MapviewComponent],
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent {}

