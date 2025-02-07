import { Component, OnInit } from '@angular/core';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-list-university',
  standalone: false,

  templateUrl: './list-university.component.html',
  styleUrl: './list-university.component.css',
})
export class ListUniversityComponent implements OnInit {
  apiUniversities: any[] = [];
  localUniversities: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  errorMessage: string = '';

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.loadApiUniversities();
  }

  loadApiUniversities() {
    // Load API universities

    this.universityService.getApiUniversities().subscribe({
      next: (data) => (this.apiUniversities = data),
      error: (err) => {
        console.error('Error loading API universities:', err);
        this.errorMessage =
          'Error loading universities from the API. Please try again later.';
      },
    });

    // Load local universities
    this.localUniversities = this.universityService.getLocalUniversities();
  }

  get filteredUniversities() {
    let allUniversities = [...this.apiUniversities, ...this.localUniversities];

    // Filtering
    let filtered = allUniversities.filter(
      (u) =>
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (u.description &&
          u.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );

    // Sorting
    filtered.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      return this.sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    // Pagination
    return filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get totalPages(): number {
    const totalItems =
      this.apiUniversities.length + this.localUniversities.length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page when search changes
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
  getPaginationPages(): number[] {
    const totalPages = this.totalPages;
    const maxPagesToShow = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
