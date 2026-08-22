import { DeleteService } from 'src/app/services/delete.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComponentsModule } from 'src/app/components/components.module';
import { IdleService } from 'src/app/services/idle.service';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    CommonModule,
    ComponentsModule,
    HomeRoutingModule,
    MatMenuModule
  ],
  providers: [DeleteService, IdleService]
})
export class HomeModule { }
