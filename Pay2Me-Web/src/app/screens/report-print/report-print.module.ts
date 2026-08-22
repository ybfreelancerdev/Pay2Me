import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportPrintComponent } from './report-print.component';
import { ReportPrintRoutingModule } from './report-print-routing.module';

@NgModule({
  declarations: [
    ReportPrintComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    ReportPrintRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  providers: [DatePipe]
})
export class ReportPrintModule { }
