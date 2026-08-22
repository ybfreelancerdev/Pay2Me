import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DropdownComponent } from './dropdown/dropdown.component';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { IndianNumberPipe } from '../pipes/indian-number.pipe';

@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent,
    DropdownComponent,
    OtpInputComponent,
    IndianNumberPipe 
  ],
  imports: [
    MatToolbarModule,
    MatCardModule,
    DragDropModule,
    MatSidenavModule,
    MatListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    RouterModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputComponent,
    ButtonComponent,
    DropdownComponent,
    MatIconModule,
    MatPaginatorModule,
    OtpInputComponent,
    IndianNumberPipe
  ]
})
export class ComponentsModule { }
