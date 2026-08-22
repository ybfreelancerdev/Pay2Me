import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { HawalaEntryRoutingModule } from './hawala-entry-routing.module';
import { HawalaEntryComponent } from './hawala-entry.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    HawalaEntryComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    HawalaEntryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule
  ],
  providers: [DatePipe]
})
export class HawalaEntryModule { }
