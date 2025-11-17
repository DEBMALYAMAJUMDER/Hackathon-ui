
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanComponent } from './scan/scan.component';
import { QueryComponent } from './query/query.component';

const routes: Routes = [
  { path: '', redirectTo: 'scan', pathMatch: 'full' },
  { path: 'scan', component: ScanComponent },
  { path: 'query', component: QueryComponent },
  { path: '**', redirectTo: 'scan' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
