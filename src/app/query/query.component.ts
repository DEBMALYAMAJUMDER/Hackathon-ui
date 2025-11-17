
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  queryForm!: FormGroup;
  response: any = null;
  history: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit() {
    this.queryForm = this.fb.group({
      repoEntities: this.fb.array([ this.fb.group({ githubUrl: ['', Validators.required], branch: ['', Validators.required] }) ]),
      query: ['', Validators.required]
    });
    this.loadHistory();
  }

  get repoEntities(): FormArray {
    return this.queryForm.get('repoEntities') as FormArray;
  }

  addRepo() {
    this.repoEntities.push(this.fb.group({ githubUrl: ['', Validators.required], branch: ['', Validators.required] }));
  }

  removeRepo(i: number) {
    if (this.repoEntities.length > 1) this.repoEntities.removeAt(i);
  }

  submit() {
    if (this.queryForm.invalid) return;
    this.loading = true; this.error = null; this.response = null;
    const payload = this.queryForm.value;
    this.api.runQuery(payload).subscribe({
      next: res => { this.response = res; this.loading = false; this.saveToHistory(payload, res); },
      error: err => { this.error = err?.message || 'Request failed'; this.loading = false; }
    });
  }

  saveToHistory(payload: any, response: any) {
    const item = { timestamp: new Date().toISOString(), payload, response };
    this.history.unshift(item);
    localStorage.setItem('query_history', JSON.stringify(this.history));
  }

  loadHistory() { this.history = JSON.parse(localStorage.getItem('query_history') || '[]'); }

  selectHistory(item: any) {
    const arr = [];
    item.payload.repoEntities.forEach((repo: any) => arr.push(this.fb.group({ githubUrl: repo.githubUrl, branch: repo.branch })));
    this.queryForm.setControl('repoEntities', arr);
    this.queryForm.patchValue({ query: item.payload.query });
    this.response = item.response;
  }
}
