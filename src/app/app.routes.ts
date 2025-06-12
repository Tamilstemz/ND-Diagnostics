import { Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';

export const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'BookAppointment', component: BookAppointmentComponent },
  { path: 'TermsOfUse', component: TermsofuseComponent },
  { path: 'PrivacyPolicy', component: PrivacypolicyComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
