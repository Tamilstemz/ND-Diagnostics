import {
  Component,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';


declare var bootstrap: any;

@Component({
  selector: 'app-secnav',
  standalone: true,
  templateUrl: './secnav.component.html',
  styleUrls: ['./secnav.component.css'],
})
export class SecnavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef<HTMLElement>;
  @ViewChild('navbarToggler', { static: false }) navbarToggler!: ElementRef<HTMLElement>;
  @ViewChild('navbar', { static: false }) navbar?: ElementRef<HTMLElement>;


  activeSection: string = 'Top-page';
  collapseInstance: any;
  showMainNavbar = false;
  private scrollThreshold = 150;
  private isDestroyed = false;
  


   constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

@HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {

    console.log('Window scrolled----nooooo',this.platformId,'99999',this.navbar?.nativeElement);
    

    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.navbar?.nativeElement) return;

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      if (this.isDestroyed) return;

      const scrollPosition = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      
      // Debug logging
      console.log('Current scroll position:', scrollPosition,'---',this.scrollThreshold);

      if (scrollPosition > this.scrollThreshold) {
        if (!this.showMainNavbar) {
          this.showMainNavbar = true;
          this.navbar?.nativeElement.classList.add('nav-scrolled');
        }
      } else {
        if (this.showMainNavbar) {
          this.showMainNavbar = false;
          this.navbar?.nativeElement.classList.remove('nav-scrolled');
        }
      }
    });
  }

  

 ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initial scroll check
      this.onWindowScroll();
      
      if (this.navbarNav) {
        // Initialize Bootstrap collapse
        this.collapseInstance = new bootstrap.Collapse(this.navbarNav.nativeElement, {
          toggle: false
        });

        // Prevent clicks inside navbar from closing it
        this.navbarNav.nativeElement.addEventListener('click', (e) => e.stopPropagation());
        
    
      }
    }
  }

   ngOnDestroy(): void {
    this.isDestroyed = true;
    if (isPlatformBrowser(this.platformId)) {
      
    }
  }

ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const totalDelay = 5000;
  setTimeout(() => {
    const carouselEl = document.getElementById('carouselBackground');
    carouselEl?.classList.add('show-carousel');
  }, totalDelay);
}




  activesetsection(sectionId: string): void {
    this.activeSection = sectionId;
  }

  navigateAndScroll(sectionId: string, event: Event): void {
    event.preventDefault();
    this.activeSection = sectionId;

    // If section is part of a different route, navigate there directly
    if (sectionId === 'Book-Appointment') {
      this.router.navigate(['/BookAppointment']);
      return;
    }

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

    if (this.router.url === '/') {
      // Already on the homepage
      setTimeout(scrollToSection, 50);
    } else {
      // Navigate to homepage and then scroll
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
