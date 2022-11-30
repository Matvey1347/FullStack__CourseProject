import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';
import { SiteLayoutLinks } from './site-layout.links';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floating') floatingRef!: ElementRef;

  links = SiteLayoutLinks;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login'])
  }

}
