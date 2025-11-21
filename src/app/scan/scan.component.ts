import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {

  scanForm: FormGroup;
  response: any = null;
  loading = false;
  error: string | null = null;

  recentUrls: string[] = [];
  showSuggestions = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.scanForm = this.fb.group({
      githubUrl: ['', Validators.required],
      branch: ['', Validators.required],
      project: ['']
    });
  }

  ngOnInit() {
    this.recentUrls = JSON.parse(localStorage.getItem('scanUrls') || '[]');
  }

  saveUrlToHistory(url: string) {
    if (!url) return;

    let saved = JSON.parse(localStorage.getItem('scanUrls') || '[]');

    if (!saved.includes(url)) {
      saved.push(url);
    }

    localStorage.setItem('scanUrls', JSON.stringify(saved));
  }

  selectUrl(url: string) {
    this.scanForm.controls['githubUrl'].setValue(url);
    this.showSuggestions = false;
  }

  hideSuggestions() {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  submit() {
    if (this.scanForm.invalid) return;

    const payload = this.scanForm.value;

    // Save GitHub URL to history
    this.saveUrlToHistory(payload.githubUrl);

    this.loading = true;
    this.response = null;
    this.error = null;

    this.api.scanRepo(payload).subscribe({
      next: res => { this.response = res; this.loading = false; },
      error: err => { this.error = err?.message || 'Request failed'; this.loading = false; }
    });
  }

  downloadJSON() {
    if (!this.response) return;
    const blob = new Blob([JSON.stringify(this.response, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan-response.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
