import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { GeneralReportsRoutingModule } from './general-reports-routing.module';
import { GeneralReportsComponent } from './general-reports.component';

@NgModule({
  declarations: [
    GeneralReportsComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    GeneralReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule
  ],
  providers: [DatePipe]
})
export class GeneralReportsModule { }
