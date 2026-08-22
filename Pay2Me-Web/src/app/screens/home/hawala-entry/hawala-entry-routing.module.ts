import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HawalaEntryComponent } from './hawala-entry.component';

const routes: Routes = [
  { path: '', component: HawalaEntryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawalaEntryRoutingModule { }
