import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-list-country',
  standalone: false,

  templateUrl: './list-country.component.html',
  styleUrl: './list-country.component.css',
})
export class ListCountryComponent implements OnInit {
  jsonCountries: any[] = [];
  localCountries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  errorMessage: string = '';

  constructor(private countryService: CountryService) {}
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.errorMessage = '';
    //load JSON Countries
    this.countryService.getJsonCountries().subscribe({
      next: (response) => {
        this.jsonCountries = response.countries;
        this.filterCountries();
      },
      error: (err) => {
        console.error('Error loading JSON countries:', err);
        this.errorMessage = 'Error loading countries from the server.';
      },
    });

    // Load local countries
    this.countryService.getLocalCountries().subscribe({
      next: (local) => {
        this.localCountries = local;
        this.filterCountries();
      },
      error: (err) => {
        console.error('Error loading local countries:', err);
        this.errorMessage = 'Error loading local countries.';
      },
    });
  }
  filterCountries() {
    const allCountries = [...this.jsonCountries, ...this.localCountries];

    //Filter
    let filtered = allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.sortname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];

      return this.sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    // Paginate
    this.filteredCountries = filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  // New methods to sort explicitly in ascending or descending order
  toggleSort(column: string) {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new sort column and default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterCountries();
  }

  get totalPages(): number {
    const totalItems = this.jsonCountries.length + this.localCountries.length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }
  changePage(page: number) {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.filterCountries();
  }
  onSearchChange() {
    this.currentPage = 1;
    this.filterCountries();
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
