import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HawalaLogsComponent } from './hawala-logs.component';

const routes: Routes = [
  { path: '', component: HawalaLogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawalaLogsRoutingModule { }
