import {
  Component,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  AfterViewInit,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-secnav',
  standalone: true,
  templateUrl: './secnav.component.html',
  styleUrls: ['./secnav.component.css'],
})
export class SecnavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef<HTMLElement>;
  @ViewChild('navbarToggler', { static: false }) navbarToggler!: ElementRef<HTMLElement>;
  @ViewChild('navbar', { static: false }) navbar?: ElementRef<HTMLElement>;

  activeSection: string = 'Top-page';
  collapseInstance: any;
  showMainNavbar = false;
  
  private isDestroyed = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const totalDelay = 5000;
    setTimeout(() => {
      const carouselEl = document.getElementById('carouselBackground');
      carouselEl?.classList.add('show-carousel');
    }, totalDelay);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;


    // Initialize Bootstrap Collapse
    if (this.navbarNav) {
      this.collapseInstance = new bootstrap.Collapse(this.navbarNav.nativeElement, {
        toggle: false,
      });

      this.navbarNav.nativeElement.addEventListener('click', (e) => e.stopPropagation());
    }

    // IntersectionObserver to detect welcome-title
    const welcomeTitle = document.getElementById('welcome-title');
    const navbarEl = this.navbar?.nativeElement;

    if (welcomeTitle && navbarEl) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.showMainNavbar = !entry.isIntersecting;
          if (this.showMainNavbar) {
            navbarEl.classList.add('nav-scrolled');
          } else {
            navbarEl.classList.remove('nav-scrolled');
          }
        },
        {
          root: null,
          threshold: 0.1,
        }
      );
      observer.observe(welcomeTitle);
    }
  }


  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  activesetsection(sectionId: string): void {
    this.activeSection = sectionId;
  }

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
