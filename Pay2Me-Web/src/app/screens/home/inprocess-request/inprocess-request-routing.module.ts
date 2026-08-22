import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InprocessRequestComponent } from './inprocess-request.component';

const routes: Routes = [
  { path: '', component: InprocessRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InprocessRequestRoutingModule { }
