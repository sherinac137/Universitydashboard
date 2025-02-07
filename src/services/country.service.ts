import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private localStorageKey = 'localCountries';
  private localCountriesSubject = new BehaviorSubject<any[]>(
    this.getFromStorage()
  );
  constructor(private http: HttpClient) {}
  getJsonCountries() {
    return this.http.get<{ countries: any[] }>('assets/countries.json');
  }

  //Local country methods
  addLocalCountry(country: any) {
    const newCountry = {
      sortname: country.sortname,
      name: country.name,
      phoneCode: country.phoneCode,
    };
    const countries = [...this.localCountriesSubject.value, newCountry];
    this.saveToStorage(countries);
    this.localCountriesSubject.next(countries);
  }

  getLocalCountries() {
    return this.localCountriesSubject.asObservable();
  }

  private getFromStorage(): any[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(countries: any[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(countries));
  }
}
