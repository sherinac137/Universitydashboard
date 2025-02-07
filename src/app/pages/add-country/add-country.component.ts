import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../services/country.service';
import { Router } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-add-country',
  standalone: false,
  templateUrl: './add-country.component.html',
  styleUrl: './add-country.component.css',
})
export class AddCountryComponent {
  countryForm: FormGroup;
  @ViewChild('confirmationModal') modalElement!: ElementRef;
  private modal: any;
  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private router: Router
  ) {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sortname: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z]{2}$')],
      ],
      phoneCode: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }
  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  onSubmit() {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }

    this.countryService.addLocalCountry(this.countryForm.value);
    console.log('Added country:', this.countryForm.value);

    this.countryForm.reset({
      name: '',
      sortname: '',
      phoneCode: '',
    });
    this.modal.show();
  }
  onModalConfirm() {
    this.modal.hide();
    this.router.navigate(['/list-country']);
  }
}
