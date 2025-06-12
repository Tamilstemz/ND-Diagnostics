import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterModule]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  activeSection: string = 'terms-of-use';

  constructor(public router: Router) {}


    navigateAndScroll(sectionId: string, event: Event): void {
    event.preventDefault();
    this.activeSection = sectionId;
    console.log('Navigating to section:', sectionId);
    
    // If section is part of a different route, navigate there directly
 

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

       if (sectionId === 'terms-of-use') {
      this.router.navigate(['/TermsOfUse']);
      setTimeout(scrollToSection, 50);
      return;
    }

     if (sectionId === 'privacy-policy') {
      this.router.navigate(['/PrivacyPolicy']);
      setTimeout(scrollToSection, 50);
      return;
    }
  }
}
