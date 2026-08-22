import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferReceiptComponent } from './transfer-receipt.component';

const routes: Routes = [
  { path: '', component: TransferReceiptComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferReceiptRoutingModule { }
