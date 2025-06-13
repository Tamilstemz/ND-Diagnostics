import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reception-view',
  standalone: true,
  imports: [],
  templateUrl: './reception-view.component.html',
})
export class ReceptionViewComponent {
  constructor(public router: Router) {}

   navigateAndScroll(sectionId: string, event: Event): void {
  event.preventDefault();

  const scrollToSection = () => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('highlighted');
      setTimeout(() => el.classList.remove('highlighted'), 1000);
    } else {
      console.warn('Element not found for id:', sectionId);
    }
  };

  // Navigate if the section is on a different route
  if (sectionId === 'Book-Appointment') {
    sectionId = 'singlenavbar';
    this.router.navigate(['/BookAppointment']).then(() => {
      setTimeout(scrollToSection, 100);
    });
  }

  // If already on the home route
  if (this.router.url === '/') {
    setTimeout(scrollToSection, 50);
  } else {
    const sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          scrollToSection();
          sub.unsubscribe();
        }, 100);
      });

    this.router.navigate(['/']);
  }
}

}
