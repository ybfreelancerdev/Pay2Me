import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralReportsComponent } from './general-reports.component';

const routes: Routes = [
  { path: '', component: GeneralReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralReportsRoutingModule { }
