import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { PartiesComponent } from './parties.component';
import { PartiesRoutingModule } from './parties-routing.module';

@NgModule({
  declarations: [
    PartiesComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    PartiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  providers: []
})
export class PartiesModule { }