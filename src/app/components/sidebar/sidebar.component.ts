import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,

  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  activeMenu: 'country' | 'university' = 'country';
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.activeMenu = this.router.url.includes('university')
        ? 'university'
        : 'country';
    });
  }
}
