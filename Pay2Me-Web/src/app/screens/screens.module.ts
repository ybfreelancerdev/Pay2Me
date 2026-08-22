import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ScreensRoutingModule } from './screens-routing.module';
import { ScreensComponent } from './screens.component';

@NgModule({
  declarations: [
    ScreensComponent
  ],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    ScreensRoutingModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ]
})
export class ScreensModule { }
