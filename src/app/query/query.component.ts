import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  queryForm: FormGroup;
  response: any = null;
  loading = false;
  error: string | null = null;

  savedUrls: string[] = [];                 // Stored URL history
  filteredUrls: string[] = [];              // Filtered suggestions
  showSuggestionsIndex: number | null = null; // Which repo index shows dropdown

  history: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.queryForm = this.fb.group({
      repoEntities: this.fb.array([
        this.fb.group({
          githubUrl: ['', Validators.required],
          branch: ['', Validators.required]   // set default properly
        })
      ]),
      query: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSavedUrls();
    this.loadHistory();
  }

  get repoEntities(): FormArray {
    return this.queryForm.get('repoEntities') as FormArray;
  }

  // ----------------------------------
  // Add / Remove repo blocks
  // ----------------------------------
  addRepo() {
    this.repoEntities.push(
      this.fb.group({
        githubUrl: ['', Validators.required],
        branch: ['main', Validators.required]
      })
    );
  }

  removeRepo(index: number) {
    this.repoEntities.removeAt(index);
  }

  // ----------------------------------
  // URL SUGGESTION LOGIC
  // ----------------------------------

  loadSavedUrls() {
    this.savedUrls = JSON.parse(localStorage.getItem('savedUrls') || '[]');
  }

  // Show suggestions when typing or on focus
  showUrlSuggestions(index: number) {
    this.loadSavedUrls();
    this.filteredUrls = [...this.savedUrls];
    this.showSuggestionsIndex = index;
  }

  // Filter the URLs based on input text
  filterUrls(event: any, index: number) {
    const value = event.target.value.toLowerCase();

    this.filteredUrls = this.savedUrls.filter(url =>
      url.toLowerCase().includes(value)
    );

    this.showSuggestionsIndex = this.filteredUrls.length > 0 ? index : null;
  }

  // Select from suggestion
  selectUrl(url: string, index: number) {
    const group = this.repoEntities.at(index) as FormGroup;
    group.patchValue({ githubUrl: url });

    this.showSuggestionsIndex = null; // hide dropdown
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showSuggestionsIndex = null;
    }, 200);
  }

  saveUrl(url: string) {
    if (!url) return;

    let list = JSON.parse(localStorage.getItem('savedUrls') || '[]');

    if (!list.includes(url)) {
      list.unshift(url);
    }

    localStorage.setItem('savedUrls', JSON.stringify(list));
    this.savedUrls = list;
  }

  // ----------------------------------
  // SUBMIT QUERY
  // ----------------------------------
  submit() {
    if (this.queryForm.invalid) return;

    this.loading = true;
    this.error = null;
    this.response = null;

    const payload = this.queryForm.value;

    // Save each repo URL
    payload.repoEntities.forEach((repo: any) => this.saveUrl(repo.githubUrl));

    this.api.runQuery(payload).subscribe({
      next: res => {
        this.response = res;
        this.loading = false;

        this.saveHistory(payload);
      },
      error: err => {
        this.error = err?.message || 'Request failed';
        this.loading = false;
      }
    });
  }

  // ----------------------------------
  // URL QUERY HISTORY
  // ----------------------------------
  saveHistory(payload: any) {
    let list = JSON.parse(localStorage.getItem('queryHistory') || '[]');

    list.unshift({
      timestamp: new Date().toLocaleString(),
      payload
    });

    if (list.length > 20) list.pop();

    localStorage.setItem('queryHistory', JSON.stringify(list));
    this.history = list;
  }

  loadHistory() {
    this.history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
  }

  selectHistory(item: any) {
    this.queryForm.patchValue({
      query: item.payload.query
    });
  }
}
