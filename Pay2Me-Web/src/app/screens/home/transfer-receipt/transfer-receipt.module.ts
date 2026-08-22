import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { TransferReceiptComponent } from './transfer-receipt.component';
import { TransferReceiptRoutingModule } from './transfer-receipt-routing.module';

@NgModule({
  declarations: [
    TransferReceiptComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    TransferReceiptRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  providers: [DatePipe]
})
export class TransferReceiptModule { }
