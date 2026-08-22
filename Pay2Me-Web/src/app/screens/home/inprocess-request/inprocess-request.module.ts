import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { InprocessRequestRoutingModule } from './inprocess-request-routing.module';
import { InprocessRequestComponent } from './inprocess-request.component';
import { MatSelectModule } from '@angular/material/select';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    InprocessRequestComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    InprocessRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    ClipboardModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  providers: [DatePipe]
})
export class InprocessRequestModule { }
