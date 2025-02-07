import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private apiUrl =
    'http://universities.hipolabs.com/search?country=United+States';
  private localStorageKey = 'localUniversities';
  private localUniversities: any[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalUniversities();
  }

  // Get API universities
  getApiUniversities() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get local universities
  getLocalUniversities() {
    return [...this.localUniversities];
  }

  // Add new university to local storage
  addLocalUniversity(university: any) {
    this.localUniversities.push(university);
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.localUniversities)
    );
  }

  private loadLocalUniversities() {
    const data = localStorage.getItem(this.localStorageKey);
    this.localUniversities = data ? JSON.parse(data) : [];
  }
}
