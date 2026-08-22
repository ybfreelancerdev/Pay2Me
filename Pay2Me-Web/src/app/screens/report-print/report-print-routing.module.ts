import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPrintComponent } from './report-print.component';

const routes: Routes = [
  { path: '', component: ReportPrintComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPrintRoutingModule { }
