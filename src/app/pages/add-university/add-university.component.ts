import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { UniversityService } from '../../../services/university.service';
import { CountryService } from '../../../services/country.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-university',
  standalone: false,
  templateUrl: './add-university.component.html',
  styleUrls: ['./add-university.component.css'],
})
export class AddUniversityComponent implements OnInit {
  universityForm: FormGroup;
  countries: any[] = [];
  loading = false;
  showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private universityService: UniversityService,
    private router: Router
  ) {
    this.universityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', Validators.required],
      alpha_two_code: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{2}$/)],
      ],
      web_pages: this.fb.array(
        [this.createWebPageField()],
        [Validators.required]
      ),
      domains: this.fb.array([this.createDomainField()], [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadCountries();
  }

  private createWebPageField(): FormControl {
    return this.fb.control('', [
      Validators.required,
      Validators.pattern(/^(http|https):\/\/[^ "]+$/),
    ]);
  }

  private createDomainField(): FormControl {
    return this.fb.control('', [
      Validators.required,
      Validators.pattern(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i),
    ]);
  }

  get webPages() {
    return this.universityForm.get('web_pages') as FormArray;
  }

  get domains() {
    return this.universityForm.get('domains') as FormArray;
  }

  private loadCountries() {
    this.loading = true;
    this.countryService.getJsonCountries().subscribe({
      next: (response) => {
        this.countries = response.countries;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading countries:', err);
        this.loading = false;
      },
    });
  }

  onCountrySelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const country = this.countries.find((c) => c.name === select.value);
    if (country) {
      this.universityForm.patchValue({ alpha_two_code: country.sortname });
    }
  }

  addWebPage() {
    this.webPages.push(this.createWebPageField());
  }

  removeWebPage(index: number) {
    this.webPages.removeAt(index);
  }

  addDomain() {
    this.domains.push(this.createDomainField());
  }

  removeDomain(index: number) {
    this.domains.removeAt(index);
  }

  onSubmit() {
    this.universityForm.markAllAsTouched();
    if (this.universityForm.invalid) return;

    const formValue = {
      ...this.universityForm.value,
      state_province: null,
      alpha_two_code: this.universityForm.value.alpha_two_code.toUpperCase(),
      name: this.universityForm.value.name.trim(),
      web_pages: this.universityForm.value.web_pages.map((wp: string) =>
        wp.trim()
      ),
      domains: this.universityForm.value.domains.map((d: string) =>
        d.toLowerCase().trim()
      ),
    };

    this.universityService.addLocalUniversity(formValue);
    this.showModal = true;
  }

  closeModal() {
    // Hide the modal
    this.showModal = false;
    this.router.navigate(['/list-university']);
  }
}
