import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HawalaTransactionsComponent } from './hawala-transactions.component';

const routes: Routes = [
  { path: '', component: HawalaTransactionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawalaTransactionsRoutingModule { }
