import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { HawalaLogsComponent } from './hawala-logs.component';
import { HawalaLogsRoutingModule } from './hawala-logs-routing.module';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    HawalaLogsComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    HawalaLogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule
  ],
  providers: [DatePipe]
})
export class HawalaLogsModule { }
