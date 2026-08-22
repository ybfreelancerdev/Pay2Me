import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalAuthGuardService } from '../services/portal-auth-guard.service';
import { ScreensComponent } from './screens.component';

const routes: Routes = [
    {
        path: '', component: ScreensComponent, children: [
            { path: 'auth', loadChildren: () => import('./auth/auth.module').then(p => p.AuthModule) },
            { path: 'home', loadChildren: () => import('./home/home.module').then(a => a.HomeModule), canActivate: [PortalAuthGuardService]},
            { path: 'report-print', loadChildren: () => import('./report-print/report-print.module').then(a => a.ReportPrintModule), canActivate: [PortalAuthGuardService]},
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreensRoutingModule { }
