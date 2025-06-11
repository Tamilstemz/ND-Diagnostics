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
import { NavbarComponent } from '../navbar/navbar.component';

declare var bootstrap: any;

@Component({
  selector: 'app-secnav',
  standalone: true,
  templateUrl: './secnav.component.html',
  styleUrls: ['./secnav.component.css'],
  // imports: [NavbarComponent]
})
export class SecnavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbarNav', { static: false })
  navbarNav!: ElementRef<HTMLElement>;
  @ViewChild('navbarToggler', { static: false })
  navbarToggler!: ElementRef<HTMLElement>;

  activeSection: string = 'Top-page';

  collapseInstance: any;
  isNavbarExpanded = false;
  isScrolled = false;
  private outsideClickListener = (event: MouseEvent) =>
    this.onDocumentClick(event);
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollTop > 50; // Adjust this threshold if needed
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.navbarNav) {
      // Initialize Bootstrap collapse for navbar
      this.collapseInstance = new bootstrap.Collapse(
        this.navbarNav.nativeElement,
        {
          toggle: false,
        }
      );

      // Prevent clicks inside navbar from closing it
      this.navbarNav.nativeElement.addEventListener('click', (e) =>
        e.stopPropagation()
      );
      // Listen for clicks outside navbar to close it
      document.addEventListener('click', this.outsideClickListener);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.outsideClickListener);
    }
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

  // Toggle collapse on hamburger click
  toggleCollapse(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.collapseInstance) return;

    if (this.isNavbarExpanded) {
      this.collapseInstance.hide();
      this.isNavbarExpanded = false;
    } else {
      this.collapseInstance.show();
      this.isNavbarExpanded = true;
    }
  }

  // Close navbar when clicking outside
  private onDocumentClick(event: MouseEvent): void {
    if (!this.collapseInstance) return;

    const collapseEl = this.navbarNav?.nativeElement;
    const togglerEl = this.navbarToggler?.nativeElement;
    const target = event.target as HTMLElement;

    if (!collapseEl || !togglerEl) return;

    const isClickedInsideNavbar = collapseEl.contains(target);
    const isClickedToggler = togglerEl.contains(target);
    const isNavbarShown = collapseEl.classList.contains('show');

    if (isNavbarShown && !isClickedInsideNavbar && !isClickedToggler) {
      this.collapseInstance.hide();
      this.isNavbarExpanded = false;
    }
  }
}
