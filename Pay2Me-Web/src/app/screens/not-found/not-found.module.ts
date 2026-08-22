import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    NotFoundRoutingModule,
  ]
})
export class NotFoundModule { }
