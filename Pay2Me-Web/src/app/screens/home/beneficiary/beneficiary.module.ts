import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { BeneficiaryComponent } from './beneficiary.component';
import { BeneficiaryRoutingModule } from './beneficiary-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    BeneficiaryComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    BeneficiaryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  providers: [DatePipe]
})
export class BeneficiaryModule { }
