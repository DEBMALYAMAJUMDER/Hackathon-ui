
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent {
  scanForm: FormGroup;
  response: any = null;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.scanForm = this.fb.group({
      githubUrl: ['', Validators.required],
      branch: ['', Validators.required],
      project: ['']
    });
  }

  submit() {
    if (this.scanForm.invalid) return;
    this.loading = true; this.response = null; this.error = null;
    const payload = this.scanForm.value;
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
    a.href = url; a.download = 'scan-response.json'; a.click();
    window.URL.revokeObjectURL(url);
  }
}
