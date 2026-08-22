import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { SendMoneyComponent } from './send-money.component';
import { SendMoneyRoutingModule } from './send-money-routing.module';

@NgModule({
  declarations: [
    SendMoneyComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    SendMoneyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  providers: [DatePipe]
})
export class SendMoneyModule { }
