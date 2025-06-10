import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  activeSection = 'Book-Appointment';

  constructor(private router: Router) {}

navigateAndScroll(sectionId: string, event: Event): void {
  event.preventDefault();
  this.activeSection = sectionId;

  const scrollToSection = () => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('highlighted');
      setTimeout(() => el.classList.remove('highlighted'), 1000);
    } else {
      console.warn('Element not found:', sectionId);
    }
  };

  const el = document.getElementById(sectionId);

  if (el) {
    // 🔁 Element already exists on the page, just scroll
    scrollToSection();
  } else if (this.router.url !== '/') {
    // Element not on this page, navigate to home and scroll after navigation
    const sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
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
