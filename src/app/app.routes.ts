import { Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';

export const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'BookAppointment', component: BookAppointmentComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
