import { Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ScheduleCalendarComponent } from './schedule-calendar/schedule-calendar.component';

export const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'BookAppointment', component: ScheduleCalendarComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
